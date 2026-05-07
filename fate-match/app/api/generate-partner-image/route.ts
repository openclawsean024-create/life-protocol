import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// ═══════════════════════════════════════════════════════════════════════════════
// 8大地區關鍵字手冊 — 城市 / 性別 / 年齡 完整對照表
// ═══════════════════════════════════════════════════════════════════════════════

const REGION_KEYWORD_MANUAL: Record<string, {
  // 背景搜尋關鍵字（城市級）
  bgSearchTerms: string[]
  // 人物照片搜尋關鍵字（Google Images 找「當地人」）
  portraitSearchTerms: { male: string[]; female: string[] }
  // 穿著風格關鍵字
  fashion: { male: string[]; female: string[] }
  // 氛圍/氣質關鍵字
  aura: string[]
  // 場景描述關鍵字
  scene: string[]
}> = {
  台灣: {
    bgSearchTerms: [
      '台北夜景 101大樓', '台北東區街景', '西門町霓虹灯',
      '台中草悟道夜景', '高雄愛河夜景', '台灣夜市人流',
    ],
    portraitSearchTerms: {
      male: [
        '台灣男性 25歲 素顏街拍', '台灣男生大學生穿搭',
        '台灣男性 natural look 寫真', ' Taiwanese male casual street photo',
      ],
      female: [
        '台灣女性 25歲 素顏街拍', '台灣女生文青穿搭',
        '台灣女性 natural look 寫真', 'Taiwanese female casual street photo',
      ],
    },
    fashion: {
      male: [
        '白色T恤 牛仔褲 乾淨清爽', '文青風格 棉麻襯衫',
        '簡單白飯店長褲 休閒鞋', '台灣街頭風格 短褲球鞋',
      ],
      female: [
        '文青打扮 白色連衣裙', '台灣女生 casual style',
        '簡單素色上衣 高腰牛仔褲', '小清新風格 帆布鞋',
      ],
    },
    aura: ['溫暖親切', '陽光男孩 / 陽光女孩', '鄰家感', '自然不做作'],
    scene: ['台北街頭', '咖啡廳外', '夜市人潮背景', '城市天際線'],
  },

  香港: {
    bgSearchTerms: [
      '香港維多利亞港夜景', '香港中環霓虹燈', '旺角街頭人流',
      '香港夜景高樓', '尖沙咀海旁夜景', '香港霓虹街景',
    ],
    portraitSearchTerms: {
      male: [
        '香港男性 25歲 街拍', 'Hong Kong male natural photo',
        '香港男生時尚街拍', 'Hong Kong young man casual portrait',
      ],
      female: [
        '香港女性 25歲 街拍', 'Hong Kong female natural photo',
        '香港女生時尚街拍', 'Hong Kong young woman casual portrait',
      ],
    },
    fashion: {
      male: [
        '黑色T恤 破洞牛仔褲 酷感', '西裝外套 休閒褲 品味',
        'Logo Tee 短褲 街頭風', '簡約黑白灰 男性穿搭',
      ],
      female: [
        '吊帶連衣裙 時尚街拍', '時尚休閒風格 墨鏡',
        '黑色短裙 設計師品牌', '都會女性穿搭 氣場十足',
      ],
    },
    aura: ['酷感有型', '獨立自主', '品味出眾', '都會時尚'],
    scene: ['香港街頭', '霓虹燈招牌背景', '維多利亞港', '中環高樓'],
  },

  中國大陸: {
    bgSearchTerms: [
      '上海外灘夜景', '北京國貿夜景', '深圳城市夜景',
      '廣州珠江夜景', '成都太古里街景', '杭州西湖夜景',
    ],
    portraitSearchTerms: {
      male: [
        '中國男性 25歲 街拍', '大陸男生 時尚寫真',
        '一線城市男性穿搭', 'Chinese male urban portrait',
      ],
      female: [
        '中國女性 25歲 街拍', '大陸女生 小姐姐風格',
        '一線城市女性穿搭', 'Chinese female urban portrait',
      ],
    },
    fashion: {
      male: [
        '簡約黑白灰 男性精英風', '設計師品牌 男士',
        '西裝商務休閒 大氣從容', '簡單白T恤 修身牛仔褲',
      ],
      female: [
        '簡約氣質小姐姐風格', '設計師品牌 女裝',
        '小香風外套 優雅感', '簡單高級感 都市女性',
      ],
    },
    aura: ['大氣從容', '精致都市感', '品味出眾', '新時代女性 / 男性'],
    scene: ['外灘背景', '高樓林立城市', '太古里街頭', 'CBD核心區'],
  },

  馬來西亞: {
    bgSearchTerms: [
      '吉隆坡雙峰塔夜景', '馬來西亞夜市街景', '檳城街頭人流',
      '吉隆坡市區夜景', '馬六甲古城夜景', '馬來西亞城市天際線',
    ],
    portraitSearchTerms: {
      male: [
        '馬來西亞男性 25歲 街拍', 'Malaysia male natural portrait',
        '華人男性馬來西亞穿搭', 'Malaysian young man casual photo',
      ],
      female: [
        '馬來西亞女性 25歲 街拍', 'Malaysia female natural portrait',
        '華人女性馬來西亞穿搭', 'Malaysian young woman casual photo',
      ],
    },
    fashion: {
      male: [
        '簡單T恤 牛仔褲 休閒', '熱帶休閒風格',
        '多元文化混搭', '簡約清爽 男性穿搭',
      ],
      female: [
        '熱帶休閒風格 女性', '多元文化混搭',
        '簡單連衣裙 清爽感', '馬來西亞女生 casual style',
      ],
    },
    aura: ['溫暖亲切', '熱帶活力', '多元開放大方', '熱情不做作'],
    scene: ['吉隆坡街頭', '雙峰塔背景', '多元文化街景', '熱帶城市夜色'],
  },

  新加坡: {
    bgSearchTerms: [
      '新加坡濱海灣金沙夜景', '新加坡城市天際線', '魚尾獅公園夜景',
      '新加坡克拉碼頭夜景', '新加坡市區夜景', '濱海灣花園夜景',
    ],
    portraitSearchTerms: {
      male: [
        '新加坡男性 25歲 街拍', 'Singapore male natural portrait',
        '新加坡男生商務休閒', 'Singaporean young man professional casual',
      ],
      female: [
        '新加坡女性 25歲 街拍', 'Singapore female natural portrait',
        '新加坡女生都市時尚', 'Singaporean young woman urban chic',
      ],
    },
    fashion: {
      male: [
        'Business Casual 都市男性', '設計師品牌 男士簡約',
        '白色襯衫 休閒褲 品味', '新加坡街頭精英風',
      ],
      female: [
        '都市時尚 女性穿搭', '設計師品牌 女裝優雅',
        '簡約職場風格 氣場', '新加坡女生 urban chic',
      ],
    },
    aura: ['都市精緻', '高效優雅', '品味出眾', '國際都會感'],
    scene: ['濱海灣背景', '都市天際線', '新加坡市區', '花園城市夜景'],
  },

  日本: {
    bgSearchTerms: [
      '東京澀谷十字路口夜景', '大阪道頓堀霓虹燈', '東京街頭人流',
      '日本都市夜景', '東京新宿夜景', '淺草寺周邊街景',
    ],
    portraitSearchTerms: {
      male: [
        '日本男性 25歲 街拍', '日本男生 URAHARA 風格',
        '東京男性自然寫真', 'Japanese male natural street photo',
      ],
      female: [
        '日本女性 25歲 街拍', '日本女生 透明感 妝容',
        '東京女性自然寫真', 'Japanese female natural street photo',
      ],
    },
    fashion: {
      male: [
        '日本街頭風格 URAHARA', '古著混搭 男性',
        '簡單白T恤 寬褲', '日本男生 鹽顔系',
      ],
      female: [
        '日本女生 透明感妝容', 'URAHARA 風格 女性',
        '簡約素色連衣裙', '日本女生 古著混搭',
      ],
    },
    aura: ['鹽顔清爽', '透明感', '自然不刻意', '日系乾淨美感'],
    scene: ['東京街頭', '澀谷十字路口背景', '大阪街頭', '日系城市夜景'],
  },

  韓國: {
    bgSearchTerms: [
      '首爾弘大街頭夜景', '首爾江南區夜景', '韓國街頭人流',
      '首爾明洞購物街夜景', '韓國都市夜景', '弘大藝術區街景',
    ],
    portraitSearchTerms: {
      male: [
        '韓國男性 25歲 街拍', '首爾男生 K-fashion',
        '韓國男生時尚寫真', 'Korean male natural street photo',
      ],
      female: [
        '韓國女性 25歲 街拍', '首爾女生 K-beauty',
        '韓國女生時尚寫真', 'Korean female natural street photo',
      ],
    },
    fashion: {
      male: [
        'K-fashion 首爾街頭風格', '設計師品牌混搭 男性',
        '簡約休閒 正裝街頭感', '韓國男生 質感穿搭',
      ],
      female: [
        'K-fashion 首爾女生穿搭', 'K-beauty 妝容',
        '設計師品牌混搭 女性', '韓國女生 網紅風格',
      ],
    },
    aura: ['K-glow 光澤感', '精緻時尚', '自拍ready', '都會魅力'],
    scene: ['首爾弘大街頭', '江南區背景', '韓國都市夜景', '明洞購物街'],
  },

  其他: {
    bgSearchTerms: [
      '亞洲都市夜景', '現代化城市天際線', '都會夜景 高樓林立',
    ],
    portraitSearchTerms: {
      male: [
        'Asian male natural portrait 25 years old',
        'Asian man casual street photo',
      ],
      female: [
        'Asian female natural portrait 25 years old',
        'Asian woman casual street photo',
      ],
    },
    fashion: {
      male: ['現代休閒風格 男性', '簡約都市穿搭', '乾淨清爽 男士'],
      female: ['現代休閒風格 女性', '簡約都市穿搭', '優雅休閒 女裝'],
    },
    aura: ['溫暖自信', '普遍吸引力', '自然不做作'],
    scene: ['都市街頭', '城市天際線', '夜景背景'],
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// GPT-4o System Prompt — 地區特色融入力
// ═══════════════════════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `You are a professional AI image prompt engineer for a dating app destiny matching feature.

Your task: Given the user's traits, gender, luckyColors, and region → generate a Stable Diffusion portrait prompt featuring a LOCAL person from that region.

Region-specific details you MUST incorporate:
- Taiwan: 文青 vibe, 鄰家溫暖, casual street style
- Hong Kong: 酷感都市, Victoria Harbour vibes, cool chic
- China: 大氣從容, first-tier city elegance, 小姐姐 style
- Malaysia: 熱帶活力, multicultural warmth, tropical freshness
- Singapore: urban chic, business elegance, Marina Bay feel
- Japan: 塩顔/透明感, URAHARA street, natural Japanese aesthetics
- Korea: K-glow, K-fashion, influencer-ready polished look
- Other: universal attractive warm aesthetic

Rules:
1. Describe traits visually (not abstractly) — eyes, expression, posture
2. Reference regional fashion keywords (city-specific where possible)
3. Use luckyColors in the outfit color palette
4. Add a regional background scene at the city level
5. Include aura/vibe keywords specific to the region
6. Prompt: 150-300 tokens. Output ONLY the prompt text.

Output format:
[Gender] portrait, realistic photography style, soft natural lighting,
[visual trait descriptions from personality],
[hair description with regional texture],
[regional fashion in luckyColors palette],
[city-level background scene with warm bokeh lights],
[regional aura/vibe], intimate close-up shot,
highly detailed, 8k, masterpiece
Negative: ugly, deformed, low resolution, watermark, text, signature, cropped, out of frame, anime, cartoon, oil painting`

// ═══════════════════════════════════════════════════════════════════════════════
// Trait → Visual Description 映射表
// ═══════════════════════════════════════════════════════════════════════════════
function traitToVisual(trait: string): string {
  const map: Record<string, string> = {
    '創意十足': 'creative sparkle in eyes, artistic vibe, innovative expression',
    '意志堅定': 'determined gaze, strong jawline, unwavering focus',
    '富有同理心': 'warm compassionate eyes, gentle expression, nurturing presence',
    '理想主義': 'dreamy faraway look, idealistic glow, aspirational posture',
    '充滿活力': 'vibrant energy, lively expression, dynamic posture',
    '善於規劃': 'thoughtful focused eyes, organized calm, methodical pose',
    '正直可靠': 'honest trustworthy eyes, reliable steady presence',
    '追求成長': 'growth-oriented posture, ambitious expression',
    '熱情洋溢': 'passionate warm smile, expressive eyes, radiant energy',
    '行動力強': 'dynamic confident posture, decisive expressive eyes',
    '充滿正能量': 'bright positive aura, radiant smile, uplifting presence',
    '敢愛敢恨': 'bold expressive eyes, passionate emotional gaze',
    '勇於冒險': 'adventurous spirit in eyes, bold dynamic posture',
    '善於表達': 'articulate expressive face, eloquent warm eyes',
    '感染力強': 'magnetic charisma, infectious warm smile',
    '積極進取': 'ambitious eager eyes, forward-looking optimistic gaze',
    '穩重踏實': 'grounded steady presence, calm composed demeanor',
    '忠誠可靠': 'loyal faithful eyes, devoted trustworthy gaze',
    '善於照顧他人': 'nurturing warm presence, caring gentle expression',
    '腳踏實地': 'practical realistic demeanor, humble steady posture',
    '有責任感': 'responsible trustworthy posture, accountable steady gaze',
    '誠實守信': 'truthful honest eyes, sincere genuine expression',
    '包容性強': 'open accepting aura, broad-minded warm presence',
    '果斷有力': 'decisive strong gaze, commanding presence',
    '執行力強': 'efficient action-oriented posture, productive focused eyes',
    '重視承諾': 'promise-keeping earnest eyes, committed reliable gaze',
    '勇於承擔': 'courageous responsible stance, accountable brave posture',
    '善於分析': 'analytical sharp eyes, logical intelligent expression',
    '理性冷靜': 'calm rational expression, composed balanced demeanor',
    '有領導力': 'leadership aura, commanding presence, inspiring eyes',
    '講究原則': 'principled orderly appearance, structured refined expression',
    '聰慧靈活': 'smart quick-witted eyes, intelligent adaptable expression',
    '適應力強': 'flexible adaptable demeanor, versatile expressive face',
    '直覺敏銳': 'intuitive perceptive eyes, sixth-sense sharp gaze',
    '善於溝通': 'articulate expressive, eloquent warm face',
    '富有智慧': 'wise knowing eyes, mature balanced expression',
    '柔情似水': 'gentle soft watery eyes, tender warm expression',
    '洞察人心': 'perceptive deep eyes, understanding insightful gaze',
    '隨機應變': 'resourceful adaptive posture, quick-witted expression',
    '溫柔': 'gentle soft demeanor, warm tender eyes, soothing presence',
    '開朗': 'bright cheerful smile, open expression, sunshine personality',
    '獨立': 'independent confident stance, self-assured expressive eyes',
    '善解人意': 'empathetic understanding eyes, supportive warm presence',
    '細心': 'meticulous attentive expression, detailed caring gaze',
    '專一深情': 'devoted faithful eyes, committed loving expression',
    '浪漫多情': 'romantic dreamy eyes, passionate warm smile',
    '才華洋溢': 'talented expressive eyes, gifted vibrant presence',
    '事業有成': 'successful professional appearance, accomplished confident aura',
    '幽默風趣': 'funny witty expression, playful warm smile',
    '成熟穩重': 'mature composed demeanor, refined balanced presence',
    '孝順父母': 'family-oriented caring eyes, devoted caring expression',
    '體貼呵護': 'caring nurturing presence, protective warm gaze',
    '積極樂觀': 'optimistic positive outlook, cheerful bright eyes',
    '踏實可靠': 'dependable grounded presence, reliable honest expression',
  }
  return map[trait] || `${trait} expressed through eyes and posture`
}

// ─── Utility functions ───────────────────────────────────────────────────────
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function pickRandom<T>(arr: T[], seed?: string): T {
  if (!arr.length) return arr[0]
  const idx = seed ? hashString(seed) % arr.length : Math.floor(Math.random() * arr.length)
  return arr[idx]
}

// ─── Download external image to base64 ──────────────────────────────────────
async function downloadToBase64(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${contentType};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

// ─── Local prompt builder (fallback) ─────────────────────────────────────────
function buildLocalPrompt(
  traits: string[],
  gender: string,
  luckyColors: string[],
  region: string,
  seed?: string
): string {
  const isFemale = gender === 'female'
  const genderWord = isFemale ? 'Female' : 'Male'
  const cfg = REGION_KEYWORD_MANUAL[region] || REGION_KEYWORD_MANUAL['其他']

  const eyeDescs = traits.slice(0, 4).map(t => traitToVisual(t)).join(', ')

  const hairOptions = isFemale
    ? ['long flowing hair with natural waves', 'silky straight long hair', 'elegant soft curls framing face', 'natural textured medium hair']
    : ['neat styled short hair', 'natural textured hair', 'clean side-parted hair', 'slightly messy natural hair']

  const hair = pickRandom(hairOptions, seed ? `${seed}-hair` : undefined)
  const colors = luckyColors?.length ? luckyColors.join(' and ') : 'warm gold tones'
  const fashion = pickRandom(cfg.fashion[isFemale ? 'female' : 'male'], seed ? `${seed}-fashion` : undefined)
  const aura = pickRandom(cfg.aura, seed ? `${seed}-aura` : undefined)
  const scene = pickRandom(cfg.scene, seed ? `${seed}-scene` : undefined)

  return `${genderWord} portrait, realistic photography style, soft natural lighting,
${eyeDescs},
${hair},
${fashion} in ${colors} color palette,
${scene} background with warm bokeh lights,
${aura}, intimate close-up shot,
highly detailed, 8k, masterpiece
Negative prompt: ugly, deformed, low resolution, watermark, text, signature, cropped, out of frame, anime, cartoon, oil painting`
}

// ─── GPT-4o prompt generation ─────────────────────────────────────────────────
async function generatePrompt(
  traits: string[],
  gender: string,
  birthDate: string,
  luckyColors: string[],
  region: string
): Promise<{ prompt: string; source: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  const cfg = REGION_KEYWORD_MANUAL[region] || REGION_KEYWORD_MANUAL['其他']

  // Add regional context to the GPT-4o system prompt call
  const userContext = `traits: ${traits.join(', ')}
gender: ${gender}
birthDate: ${birthDate || 'unknown'}
luckyColors: ${(luckyColors || []).join(', ')}
region: ${region}

Region keyword reference:
- Fashion: ${cfg.fashion[gender === 'female' ? 'female' : 'male'].join(' | ')}
- Aura: ${cfg.aura.join(' | ')}
- Scene: ${cfg.scene.join(' | ')}`

  if (apiKey && apiKey.startsWith('sk-') && apiKey !== 'your-openai-api-key') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userContext },
          ],
          max_tokens: 500,
          temperature: 0.8,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        const prompt = data.choices?.[0]?.message?.content?.trim()
        if (prompt) return { prompt, source: 'gpt-4o' }
      }
    } catch (err) {
      console.error('GPT-4o failed:', err)
    }
  }

  const seed = `${birthDate}${gender}${region}`
  return { prompt: buildLocalPrompt(traits, gender, luckyColors || [], region, seed), source: 'local' }
}

// ─── Google Images search for background ─────────────────────────────────────
async function searchBackground(region: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID
  if (!apiKey || !engineId || apiKey === 'your-google-search-api-key') return null

  const cfg = REGION_KEYWORD_MANUAL[region] || REGION_KEYWORD_MANUAL['其他']
  const query = pickRandom(cfg.bgSearchTerms)
  const fullQuery = `${query} horizontal cityscape night photography`

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(fullQuery)}&cx=${engineId}&key=${apiKey}&searchType=image&num=3&imgSize=medium&imgType=photo`,
      { headers: { 'Accept': 'application/json' } }
    )
    if (!searchRes.ok) return null
    const data = await searchRes.json()
    const items = data.items || []
    if (!items.length) return null

    // Pick a random one from the top 3
    const item = items[Math.floor(Math.random() * items.length)]
    return await downloadToBase64(item.link, 8000)
  } catch {
    return null
  }
}

// ─── Google Images search for local portrait ─────────────────────────────────
async function searchLocalPortrait(region: string, gender: string): Promise<string | null> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID
  if (!apiKey || !engineId || apiKey === 'your-google-search-api-key') return null

  const cfg = REGION_KEYWORD_MANUAL[region] || REGION_KEYWORD_MANUAL['其他']
  const terms = cfg.portraitSearchTerms[gender === 'female' ? 'female' : 'male']
  const query = pickRandom(terms)
  const fullQuery = `${query} realistic photo close-up face`

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(fullQuery)}&cx=${engineId}&key=${apiKey}&searchType=image&num=3&imgSize=medium&imgType=photo`,
      { headers: { 'Accept': 'application/json' } }
    )
    if (!searchRes.ok) return null
    const data = await searchRes.json()
    const items = data.items || []
    if (!items.length) return null

    const item = items[Math.floor(Math.random() * items.length)]
    return await downloadToBase64(item.link, 8000)
  } catch {
    return null
  }
}

// ─── Sharp composite ─────────────────────────────────────────────────────────
async function compositeWithBackground(portraitBase64: string, backgroundBase64: string): Promise<string> {
  const portraitData = portraitBase64.replace(/^data:image\/\w+;base64,/, '')
  const backgroundData = backgroundBase64.replace(/^data:image\/\w+;base64,/, '')

  const portraitBuf = Buffer.from(portraitData, 'base64')
  const bgBuf = Buffer.from(backgroundData, 'base64')

  // Process background: 1024x1024, blur, darken for depth
  const processedBg = await sharp(bgBuf)
    .resize(1024, 1024, { fit: 'cover', position: 'center' })
    .blur(3)
    .modulate({ brightness: 0.6, saturation: 0.85 })
    .toBuffer()

  // Process portrait: circular mask for dating app aesthetic
  // First make a square portrait, then apply a circular gradient mask
  const portraitMeta = await sharp(portraitBuf).metadata()
  const portraitSize = Math.min(portraitMeta.width || 512, portraitMeta.height || 512)

  // Create a circular mask
  // Create a circular mask using SVG
  const svgCircle = Buffer.from(
    `<svg width="${portraitSize}" height="${portraitSize}">
      <defs>
        <radialGradient id="g">
          <stop offset="60%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${portraitSize/2}" cy="${portraitSize/2}" r="${portraitSize/2}" fill="url(#g)"/>
    </svg>`
  )

  const processedPortrait = await sharp(portraitBuf)
    .resize(portraitSize, portraitSize, { fit: 'cover', position: 'center' })
    .toBuffer()

  // Apply circular vignette mask to portrait
  const portraitWithMask = await sharp(processedPortrait)
    .composite([{
      input: svgCircle,
      blend: 'dest-in',
    }])
    .ensureAlpha()
    .toBuffer()

  // Scale portrait for composition
  const scaledPortrait = await sharp(portraitWithMask)
    .resize(680, 680, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()

  // Darken background for depth
  const bgDark = await sharp(processedBg)
    .modulate({ brightness: 0.85 })
    .toBuffer()

  // Composite
  const composited = await sharp(bgDark)
    .composite([{ input: scaledPortrait, gravity: 'center' }])
    .png()
    .toBuffer()

  return `data:image/png;base64,${composited.toString('base64')}`
}

// ─── Sharp composite (rectangular portrait, no mask) ───────────────────────
async function compositeRectPortrait(portraitBase64: string, backgroundBase64: string): Promise<string> {
  const portraitData = portraitBase64.replace(/^data:image\/\w+;base64,/, '')
  const backgroundData = backgroundBase64.replace(/^data:image\/\w+;base64,/, '')

  const portraitBuf = Buffer.from(portraitData, 'base64')
  const bgBuf = Buffer.from(backgroundData, 'base64')

  const processedBg = await sharp(bgBuf)
    .resize(1024, 1024, { fit: 'cover', position: 'center' })
    .blur(4)
    .modulate({ brightness: 0.65, saturation: 0.9 })
    .toBuffer()

  const processedPortrait = await sharp(portraitBuf)
    .resize(680, 680, { fit: 'cover', position: 'center' })
    .toBuffer()

  const result = await sharp(processedBg)
    .composite([{ input: processedPortrait, gravity: 'center' }])
    .png()
    .toBuffer()

  return `data:image/png;base64,${result.toString('base64')}`
}

// ─── Stability AI generation ─────────────────────────────────────────────────
async function generateWithStabilityAI(apiKey: string, prompt: string): Promise<string> {
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
          { text: prompt, weight: 1 },
          { text: 'ugly, deformed, low resolution, watermark, text, signature, cropped, out of frame, anime, cartoon, oil painting', weight: -1 },
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
      }),
    }
  )
  if (!response.ok) throw new Error(`Stability AI ${response.status}`)
  const data = await response.json()
  const base64 = data.artifacts?.[0]?.base64
  if (!base64) throw new Error('No image in response')
  return `data:image/png;base64,${base64}`
}

// ─── Main route ───────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const { traits, gender, birthDate, luckyColors, region } = await request.json()

    if (!traits || !gender) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const regionParam = region || '其他'
    const genderParam = gender === 'female' ? 'female' : 'male'

    // Step 1: Generate region-aware prompt
    const { prompt, source: promptSource } = await generatePrompt(
      traits, gender, birthDate || '', luckyColors || [], regionParam
    )

    // Step 2: Try Stability AI (full AI-generated image)
    let imageUrl = ''
    let imageSource = 'none'
    const stabilityKey = process.env.STABILITY_API_KEY

    if (stabilityKey && stabilityKey.startsWith('sk-') && stabilityKey !== 'your-stability-api-key') {
      try {
        imageUrl = await generateWithStabilityAI(stabilityKey, prompt)
        imageSource = 'stability_ai'
      } catch (err) {
        console.error('Stability AI failed:', err)
      }
    }

    // Step 3: Try Google Images for local portrait
    if (!imageUrl) {
      const localPortrait = await searchLocalPortrait(regionParam, genderParam)
      if (localPortrait) {
        imageUrl = localPortrait
        imageSource = 'google_local_portrait'
      }
    }

    // Step 4: Fallback to randomuser.me
    if (!imageUrl) {
      const seed = `${regionParam}${birthDate?.replace(/-/g, '') || Date.now()}${gender}`
      try {
        const res = await fetch(
          `https://randomuser.me/api/?seed=${encodeURIComponent(seed)}&gender=${genderParam}&inc=picture,name`,
          { signal: AbortSignal.timeout(5000) }
        )
        if (res.ok) {
          const data = await res.json()
          if (data.results?.[0]?.picture?.large) {
            imageUrl = data.results[0].picture.large
            imageSource = 'randomuser'
          }
        }
      } catch {
        // continue
      }
    }

    // Step 5: Final dicebear fallback
    if (!imageUrl) {
      const seed = `${regionParam}${birthDate || Date.now()}`
      imageUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`
      imageSource = 'dicebear'
    }

    // Step 6: Background search + composite (for ALL portrait types)
    const enableBg = process.env.ENABLE_BACKGROUND_COMPOSITE !== 'false'
    const bgUrl = enableBg ? await searchBackground(regionParam) : null

    if (bgUrl && imageUrl && !imageUrl.endsWith('.svg')) {
      // Download external portrait URL to base64 if needed
      let portraitBase64 = imageUrl
      if (!imageUrl.startsWith('data:')) {
        const downloaded = await downloadToBase64(imageUrl, 8000)
        if (downloaded) portraitBase64 = downloaded
        else {
          // Cannot download, return original URL
          return NextResponse.json({
            success: true,
            imageUrl,
            promptUsed: prompt,
            promptSource,
            source: imageSource,
            regionNote: `背景合成失敗（圖片格式不支援），使用原始照片`,
          })
        }
      }

      try {
        const composited = await compositeRectPortrait(portraitBase64, bgUrl)
        imageUrl = composited
        imageSource = `${imageSource}+bg`
      } catch (err) {
        console.error('Composite failed:', err)
        // Keep original imageUrl on composite failure
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      promptUsed: prompt,
      promptSource,
      source: imageSource,
      regionNote: imageSource.startsWith('google') ? `📍 當地${regionParam}人物照片` : undefined,
    })
  } catch (error) {
    console.error('Generate partner image error:', error)
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }
}
