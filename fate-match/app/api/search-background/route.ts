import { NextRequest, NextResponse } from 'next/server'

const REGION_SEARCH_TERMS: Record<string, string[]> = {
  台灣: ['Taiwan cityscape', 'Taiwan street view', 'Taiwan urban night', 'Taiwan night market Taipei 101'],
  香港: ['Hong Kong skyline night', 'Victoria Harbour', 'Hong Kong urban street', 'Hong Kong neon lights'],
  中國大陸: ['Shanghai Bund night', 'Beijing cityscape', 'Guangzhou canton tower', 'Shenzhen metropolitan'],
  馬來西亞: ['Kuala Lumpur Petronas Towers', 'Penang street art Malaysia', 'Malaysia night market'],
  新加坡: ['Marina Bay Sands Singapore', 'Singapore cityscape', 'Gardens by the Bay Singapore'],
  日本: ['Tokyo Shibuya night', 'Osaka Dotonbori', 'Japanese urban street', 'Japan night cityscape'],
  韓國: ['Seoul Hongdae night', 'Gangnam Seoul', 'Korean urban street night', 'Korea cityscape night'],
  其他: ['Asian urban cityscape night', 'modern cityscape at night', 'bokeh city lights'],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region') || '其他'

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!apiKey || !engineId || apiKey === 'your-google-search-api-key') {
    return NextResponse.json({ imageUrl: null, reason: 'Google Search API not configured' })
  }

  const searchTerms = REGION_SEARCH_TERMS[region] || REGION_SEARCH_TERMS['其他']
  const query = searchTerms[Math.floor(Math.random() * searchTerms.length)]

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${engineId}&key=${apiKey}&searchType=image&num=1&imgSize=medium`,
      { headers: { 'Accept': 'application/json' } }
    )

    if (!searchRes.ok) {
      console.error('Google Search error:', searchRes.status)
      return NextResponse.json({ imageUrl: null, reason: 'search_failed' })
    }

    const searchData = await searchRes.json()
    const imageUrl = searchData.items?.[0]?.link

    if (!imageUrl) {
      return NextResponse.json({ imageUrl: null, reason: 'no_results' })
    }

    // Download and base64 encode the image
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const imgRes = await fetch(imageUrl, { signal: controller.signal })
    clearTimeout(timeout)

    if (!imgRes.ok || !imgRes.headers.get('content-type')?.startsWith('image/')) {
      return NextResponse.json({ imageUrl: null, reason: 'invalid_image' })
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer())
    const base64 = buffer.toString('base64')
    const mimeType = imgRes.headers.get('content-type') || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({
      imageUrl: dataUrl,
      sourceUrl: imageUrl,
      region,
      query,
    })
  } catch (err) {
    console.error('Search background error:', err)
    return NextResponse.json({ imageUrl: null, reason: 'timeout_or_error' })
  }
}