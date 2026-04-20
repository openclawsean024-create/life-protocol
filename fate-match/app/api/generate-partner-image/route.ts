import { NextRequest, NextResponse } from 'next/server'

const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬']

function getZodiacAnimal(birthDate: string): string {
  const year = new Date(birthDate).getFullYear()
  const baseYear = 1984
  const diff = ((year - baseYear) % 12) + 12
  return ZODIAC_ANIMALS[diff % 12]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { traits, gender, birthDate, luckyColors, region } = body

    if (!traits || !gender || !birthDate) {
      return NextResponse.json({ error: '缺少必要參數' }, { status: 400 })
    }

    const zodiac = getZodiacAnimal(birthDate)
    const seed = `${zodiac}${birthDate.replace(/-/g, '')}${gender}`

    // Build the prompt based on traits
    const prompt = buildPrompt(traits, gender, zodiac, luckyColors, region, seed)

    // Check if Stability AI key is available
    const stabilityKey = process.env.STABILITY_API_KEY
    if (stabilityKey && stabilityKey !== 'your-stability-api-key') {
      // Use Stability AI
      try {
        const imageResult = await generateWithStabilityAI(stabilityKey, prompt, gender)
        return NextResponse.json({
          success: true,
          imageUrl: imageResult,
          promptUsed: prompt,
          source: 'stability_ai',
        })
      } catch (err) {
        console.error('Stability AI failed, falling back to randomuser.me:', err)
      }
    }

    // Fallback: use randomuser.me for portrait photo
    const genderParam = gender === 'female' ? 'female' : 'male'
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)

      const res = await fetch(
        `https://randomuser.me/api/?seed=${encodeURIComponent(seed)}&gender=${genderParam}&inc=picture,name`,
        { signal: controller.signal }
      )
      clearTimeout(timeout)

      if (res.ok) {
        const data = await res.json()
        if (data.results?.[0]?.picture?.large) {
          return NextResponse.json({
            success: true,
            imageUrl: data.results[0].picture.large,
            promptUsed: prompt,
            source: 'randomuser',
            partnerName: data.results[0].name?.first || '命定之人',
          })
        }
      }
    } catch {
      // Fall through to DiceBear
    }

    // Final fallback: DiceBear avatar
    const fallbackUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4&hair=long01,long02&hairColor=4a3020&skinColor=f5d0c5`
    return NextResponse.json({
      success: true,
      imageUrl: fallbackUrl,
      promptUsed: prompt,
      source: 'dicebear',
    })
  } catch (error) {
    console.error('Generate partner image error:', error)
    return NextResponse.json({ error: '圖片生成失敗，請稍後再試' }, { status: 500 })
  }
}

const REGION_PROMPTS: Record<string, string> = {
  台灣: '台灣年輕人穿著，台北街頭背景，自然髮色，淡妝，日常穿著',
  香港: '香港街頭背景，時尚都會風格，粵語氣質',
  中國大陸: '一線城市年輕人穿著，上海或北京場景背景',
  馬來西亞: '多元種族融合風格，吉隆坡背景，熱帶氣息',
  新加坡: '新加坡都市風格，種族融合特徵，商務休閒',
  日本: '日本街頭風格，東京或大阪背景，時尚潮流，自然妝容',
  韓國: '韓系街頭風格，首爾背景，K-beauty 妝容，時尚穿著',
  其他: '亞洲都市背景',
}

function buildPrompt(traits: string[], gender: string, zodiac: string, luckyColors?: string[], region?: string, seed?: string): string {
  const genderWord = gender === 'female' ? '女性' : '男性'
  const traitWords = traits.slice(0, 5).join('、')

  const hairOptions = gender === 'female'
    ? ['長髮飄逸', '柔順長髮', '氣質長髮']
    : ['短髮精神', '整齊短髮', '帥氣短髮']

  const hair = hairOptions[Math.floor(Math.abs(hashString(seed || '')) % hairOptions.length)]
  const color = luckyColors?.[0] || '金色'
  const regionEnhancement = region ? REGION_PROMPTS[region] || REGION_PROMPTS['其他'] : ''

  return `${genderWord}人物肖像，寫實風格，柔和光線，${traitWords}眼神，${hair}，${regionEnhancement}，氣質出眾，表情溫柔，精緻細節，高解析度，8k品質`
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}

async function generateWithStabilityAI(apiKey: string, prompt: string, gender: string): Promise<string> {
  const response = await fetch(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
          {
            text: '醜，畸形，低解析度，油畫質感，手繪，動漫，模糊',
            weight: -1,
          },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Stability AI error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  if (!data.artifacts?.[0]?.base64) {
    throw new Error('No image in Stability AI response')
  }

  return `data:image/png;base64,${data.artifacts[0].base64}`
}
