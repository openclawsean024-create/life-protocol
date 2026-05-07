import { NextRequest, NextResponse } from 'next/server'

// 8大 region 地區關鍵字手冊 (for fallback prompt building)
const REGION_KEYWORDS: Record<string, {
  scene: string[]
  fashion: string[]
  hair: string[]
  makeup: string[]
  aura: string[]
}> = {
  台灣: {
    scene: ['Taipei cityscape', 'Taiwan street market', 'Taiwan neon night view'],
    fashion: ['casual Taiwanese street fashion', 'white tee with jeans', '文青打扮'],
    hair: ['natural black long straight hair', 'slight inward curl', 'air bangs fringe'],
    makeup: ['fresh natural makeup', 'no-makeup makeup look'],
    aura: ['gentle warmth', 'girl-next-door vibe'],
  },
  香港: {
    scene: ['Hong Kong skyline at night', 'Victoria Harbour', 'Mong Kok neon lights'],
    fashion: ['Hong Kong fashion', 'logo tee with shorts', 'cool chic style'],
    hair: ['slight wave bob', 'straight hair with ion烫', 'air bangs'],
    makeup: ['matte foundation', 'matte lipstick', 'natural makeup'],
    aura: ['independent cool vibe', 'not following trends but tasteful'],
  },
  中國大陸: {
    scene: ['Shanghai Bund night view', 'Beijing Wangfujing', 'Shenzhen metropolitan'],
    fashion: ['first-tier city fashion', 'minimalist black white grey', 'designer brands'],
    hair: ['elaborately styled long hair', 'smooth straight or big waves'],
    makeup: ['精緻妝容', 'matte finish', 'bold red lipstick'],
    aura: ['大氣從容', '小姐姐風格'],
  },
  馬來西亞: {
    scene: ['Kuala Lumpur Petronas Twin Towers', 'Malaysia night market'],
    fashion: ['multicultural mix style', 'simple tee and jeans'],
    hair: ['natural black short hair', 'conservatively styled'],
    makeup: ['清新自然妝容', 'light makeup focus'],
    aura: ['多元包容', 'warm and approachable'],
  },
  新加坡: {
    scene: ['Marina Bay Sands', 'Gardens by the Bay', 'Singapore cityscape'],
    fashion: ['business casual style', 'designer brands', 'smart casual'],
    hair: ['well-groomed short to medium hair', 'neat styling'],
    makeup: ['精緻職業妝容', 'nude makeup look'],
    aura: ['都市時尚', '高效優雅'],
  },
  日本: {
    scene: ['Tokyo Shibuya crossing', 'Osaka Dotonbori', 'Japanese urban night'],
    fashion: ['Japanese street fashion', 'URAHARA style', 'vintage mix'],
    hair: ['霧面灰棕 hair', 'air-style short hair', 'layers'],
    makeup: ['透明感妝容', '血色感妝容', '垂眼妝'],
    aura: ['鹽顔', '清爽系'],
  },
  韓國: {
    scene: ['Seoul Hongdae', 'Gangnam district', 'Korean urban night scene'],
    fashion: ['K-fashion', 'Seoul street style', 'designer mix'],
    hair: ['Korean-style long hair', '水光長髮', 'air bangs'],
    makeup: ['K-beauty glow makeup', 'glass lips', 'light foundation'],
    aura: ['韓系精緻感', '網紅感'],
  },
  其他: {
    scene: ['Asian urban cityscape', 'modern metropolitan background', 'soft bokeh lights'],
    fashion: ['Modern casual fashion', 'clean and simple style', 'timeless elegant'],
    hair: ['Natural healthy hair', 'well-maintained', 'classic styling'],
    makeup: ['Natural makeup', 'glowing skin'],
    aura: ['Universally attractive', 'confident and warm'],
  },
}

const SYSTEM_PROMPT = `You are a professional AI image prompt engineer specialized in creating Stable Diffusion prompts from destiny analysis results.

User will provide: traits (array), gender (male/female), luckyColors (array), region.

Supported regions and keywords:
- Taiwan: Taipei street scene, casual fashion, 文青 style
- Hong Kong: Victoria Harbour, neon lights, HK fashion
- China: Shanghai Bund, Beijing wangfujing, modern fashion
- Malaysia: Petronas Towers, multicultural mix
- Singapore: Marina Bay Sands, business casual
- Japan: Tokyo Shibuya, Japanese street fashion, 透明感 makeup
- Korea: Seoul Hongdae, K-beauty, K-fashion
- Other: Asian urban cityscape

Rules:
1. Convert each trait to visual description (not abstract adjectives)
2. Add regional style keywords (clothing/scene/makeup)
3. Incorporate luckyColors into outfit color palette
4. Prompt length: 150-300 tokens
5. Output ONLY the prompt text, no explanation

Format: Male/Female portrait, realistic photography style, soft natural lighting, [trait visual descriptions], [hair description], [regional fashion + lucky colors], [regional background scene], [aura], highly detailed, 8k, masterpiece
Negative prompt: ugly, deformed, low resolution, watermark, text, signature, cropped, out of frame, anime, cartoon`

function pickRandom<T>(arr: T[], seed?: string): T {
  const idx = seed ? Math.abs(hashString(seed)) % arr.length : Math.floor(Math.random() * arr.length)
  return arr[idx]
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return hash
}

function traitToVisual(trait: string): string {
  const map: Record<string, string> = {
    '創意十足': 'creative sparkle in eyes, artistic vibe',
    '意志堅定': 'determined gaze, strong jawline',
    '富有同理心': 'warm compassionate eyes, gentle expression',
    '理想主義': 'dreamy faraway look, idealistic glow',
    '充滿活力': 'vibrant energy, lively expression',
    '善於規劃': 'thoughtful focused eyes',
    '正直可靠': 'honest trustworthy eyes',
    '追求成長': 'growth-oriented posture',
    '熱情洋溢': 'passionate warm smile, expressive eyes',
    '行動力強': 'dynamic confident posture',
    '充滿正能量': 'bright positive aura, radiant smile',
    '敢愛敢恨': 'bold expressive eyes',
    '勇於冒險': 'adventurous spirit in eyes',
    '善於表達': 'expressive face',
    '感染力強': 'magnetic charisma',
    '積極進取': 'ambitious eager eyes',
    '穩重踏實': 'grounded steady presence',
    '忠誠可靠': 'loyal faithful eyes',
    '善於照顧他人': 'nurturing warm presence',
    '腳踏實地': 'practical realistic demeanor',
    '有責任感': 'responsible trustworthy posture',
    '誠實守信': 'truthful honest eyes',
    '包容性強': 'open accepting aura',
    '果斷有力': 'decisive strong gaze',
    '執行力強': 'efficient action-oriented posture',
    '重視承諾': 'promise-keeping earnest eyes',
    '勇於承擔': 'courageous responsible stance',
    '善於分析': 'analytical sharp eyes',
    '理性冷靜': 'calm rational expression',
    '有領導力': 'leadership aura',
    '講究原則': 'principled orderly appearance',
    '聰慧靈活': 'smart quick-witted eyes',
    '適應力強': 'flexible adaptable demeanor',
    '直覺敏銳': 'intuitive perceptive eyes',
    '善於溝通': 'articulate expressive',
    '富有智慧': 'wise knowing eyes',
    '柔情似水': 'gentle soft watery eyes',
    '洞察人心': 'perceptive deep eyes',
    '隨機應變': 'resourceful adaptive posture',
    '溫柔': 'gentle soft demeanor, warm tender eyes',
    '開朗': 'bright cheerful smile, open expression',
    '獨立': 'independent confident stance',
    '善解人意': 'empathetic understanding eyes',
    '細心': 'meticulous attentive expression',
    '專一深情': 'devoted faithful eyes',
    '浪漫多情': 'romantic dreamy eyes',
    '才華洋溢': 'talented expressive eyes',
    '事業有成': 'successful professional appearance',
    '幽默風趣': 'funny witty expression',
    '成熟穩重': 'mature composed demeanor',
    '孝順父母': 'family-oriented caring eyes',
    '體貼呵護': 'caring nurturing presence',
    '積極樂觀': 'optimistic positive outlook',
    '踏實可靠': 'dependable grounded presence',
  }
  return map[trait] || `${trait} expressed through eyes and posture`
}

function buildFallbackPrompt(traits: string[], gender: string, luckyColors: string[], region: string, seed?: string): string {
  const isFemale = gender === 'female'
  const genderWord = isFemale ? 'Female' : 'Male'

  const eyeDescs = traits.slice(0, 4).map(t => traitToVisual(t)).join(', ')

  const hairOptions = isFemale
    ? ['long flowing hair with natural waves', 'silky straight long hair', 'elegant soft curls framing face']
    : ['neat styled short hair', 'natural textured hair', 'clean side-parted hair']
  const hair = pickRandom(hairOptions, seed ? `${seed}-hair` : undefined)

  const colors = luckyColors?.length ? luckyColors.join(' and ') : 'warm gold tones'

  const regionData = REGION_KEYWORDS[region] || REGION_KEYWORDS['其他']
  const scene = pickRandom(regionData.scene, seed ? `${seed}-scene` : undefined)
  const fashion = pickRandom(regionData.fashion, seed ? `${seed}-fashion` : undefined)
  const aura = pickRandom(regionData.aura, seed ? `${seed}-aura` : undefined)

  return `${genderWord} portrait, realistic photography style, soft natural lighting,
${eyeDescs},
${hair},
${fashion} in ${colors} color palette,
${scene} background with warm bokeh lights,
${aura}, intimate close-up shot,
highly detailed, 8k, masterpiece
Negative prompt: ugly, deformed, low resolution, watermark, text, signature, cropped, out of frame, anime, cartoon`
}

export async function POST(request: NextRequest) {
  try {
    const { traits, gender, birthDate, luckyColors, region } = await request.json()

    if (!traits || !gender) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (apiKey && apiKey.startsWith('sk-') && apiKey !== 'your-openai-api-key') {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `traits: ${traits.join(', ')}\ngender: ${gender}\nbirthDate: ${birthDate || 'unknown'}\nluckyColors: ${(luckyColors || []).join(', ')}\nregion: ${region || '其他'}` },
            ],
            max_tokens: 400,
            temperature: 0.8,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const prompt = data.choices?.[0]?.message?.content?.trim()
          if (prompt) {
            return NextResponse.json({ prompt, source: 'gpt-4o' })
          }
        }
      } catch (err) {
        console.error('GPT-4o prompt generation failed:', err)
      }
    }

    // Fallback: build prompt locally with region keywords
    const seed = `${birthDate || ''}${gender}${region || '其他'}`
    const prompt = buildFallbackPrompt(traits, gender, luckyColors || [], region || '其他', seed)
    return NextResponse.json({ prompt, source: 'local' })
  } catch (error) {
    console.error('Generate prompt error:', error)
    return NextResponse.json({ error: 'Prompt generation failed' }, { status: 500 })
  }
}
