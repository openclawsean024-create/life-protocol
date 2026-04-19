const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

const STEM_WUXING: Record<string, string> = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

const BRANCH_WUXING: Record<string, string> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

const BRANCH_POSITIONS: Record<string, number> = {
  子: 0, 丑: 1, 寅: 2, 卯: 3, 辰: 4, 巳: 5,
  午: 6, 未: 7, 申: 8, 酉: 9, 戌: 10, 亥: 11,
}

function getStemIndex(year: number): number {
  return (((year - 4) % 10) + 10) % 10
}

function getBranchIndex(year: number): number {
  return (((year - 4) % 12) + 12) % 12
}

function getStemFromDay(dateStr: string): { stemIndex: number; branchIndex: number } {
  const date = new Date(dateStr)
  const baseDate = new Date(1984, 1, 6)
  const diffDays = Math.floor((date.getTime() - baseDate.getTime()) / 86400000)
  return {
    stemIndex: ((diffDays % 10) + 10) % 10,
    branchIndex: ((diffDays % 12) + 12) % 12,
  }
}

export interface BaziResult {
  year: string
  month: string
  day: string
  hour: string
}

export interface WuxingScores {
  木: number
  火: number
  土: number
  金: number
  水: number
}

export function calcBazi(birthDate: string): BaziResult {
  const d = new Date(birthDate)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const hour = d.getHours()

  const yStem = getStemIndex(year)
  const yBranch = getBranchIndex(year)
  const yinYang = yStem % 2
  const mBranchIdx = (2 + month - 2 + (yinYang === 0 ? 0 : 1)) % 12
  const mStemIdx = ((yStem % 5) * 2 + month) % 10

  const { stemIndex: dStemIdx, branchIndex: dBranchIdx } = getStemFromDay(birthDate)
  const hBranchIdx = Math.floor(hour / 2) % 12
  const hStemIdx = (dStemIdx * 2 + Math.floor(hour / 2)) % 10

  return {
    year: HEAVENLY_STEMS[yStem] + EARTHLY_BRANCHES[yBranch],
    month: HEAVENLY_STEMS[mStemIdx] + EARTHLY_BRANCHES[mBranchIdx],
    day: HEAVENLY_STEMS[dStemIdx] + EARTHLY_BRANCHES[dBranchIdx],
    hour: HEAVENLY_STEMS[hStemIdx] + EARTHLY_BRANCHES[hBranchIdx],
  }
}

export function calcWuxingBalance(bazi: string): WuxingScores {
  const scores: WuxingScores = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 }
  const stemEl = STEM_WUXING[bazi[0]] ?? '土'
  const branchEl = BRANCH_WUXING[bazi[1]] ?? '土'
  scores[stemEl as keyof WuxingScores]++
  scores[branchEl as keyof WuxingScores]++
  return scores
}

export function mergeWuxing(a: WuxingScores, b: WuxingScores): WuxingScores {
  return { 木: a.木 + b.木, 火: a.火 + b.火, 土: a.土 + b.土, 金: a.金 + b.金, 水: a.水 + b.水 }
}

export function generateExplanation(
  myBazi: BaziResult,
  partnerBazi: BaziResult,
): string[] {
  const explanations: string[] = []

  const yStemMy = myBazi.year[0]
  const yStemPartner = partnerBazi.year[0]
  const yBranchMy = myBazi.year[1]
  const yBranchPartner = partnerBazi.year[1]

  const stemDiff = Math.abs(HEAVENLY_STEMS.indexOf(yStemMy) - HEAVENLY_STEMS.indexOf(yStemPartner))
  if (stemDiff === 5) {
    explanations.push(`年柱天干${yStemMy}${yStemPartner}成五合之局，象徵命中注定的牽絆，是非常難得的機緣。`)
  }

  const branchDiff = Math.abs((BRANCH_POSITIONS[yBranchMy] ?? 0) - (BRANCH_POSITIONS[yBranchPartner] ?? 0))
  if (branchDiff === 4 || branchDiff === 8) {
    explanations.push(`年柱地支${yBranchMy}${yBranchPartner}形成三合局，三人成局能量旺盛，能互相增幅。`)
  } else if (branchDiff === 6) {
    explanations.push(`年柱地支${yBranchMy}${yBranchPartner}相冲，動力強但不穩定，需要磨合。`)
  }

  const dStemMy = myBazi.day[0]
  const dStemPartner = partnerBazi.day[0]
  const dBranchMy = myBazi.day[1]
  const dBranchPartner = partnerBazi.day[1]

  const dStemDiff = Math.abs(HEAVENLY_STEMS.indexOf(dStemMy) - HEAVENLY_STEMS.indexOf(dStemPartner))
  if (dStemDiff === 5) {
    explanations.push(`日柱天干${dStemMy}${dStemPartner}正合，夫妻之緣，感情專一而深刻。`)
  }

  const dBranchDiff = Math.abs((BRANCH_POSITIONS[dBranchMy] ?? 0) - (BRANCH_POSITIONS[dBranchPartner] ?? 0))
  if (dBranchDiff === 6) {
    explanations.push(`日柱地支${dBranchMy}${dBranchPartner}相冲，感情張力大，需相互包容才能長久。`)
  } else if (dBranchDiff === 0) {
    explanations.push(`日柱地支相同（${dBranchMy}），命格相近相吸，相處和諧默契。`)
  }

  if (explanations.length < 3) {
    const monthDiff = Math.abs((BRANCH_POSITIONS[myBazi.month[1]] ?? 0) - (BRANCH_POSITIONS[partnerBazi.month[1]] ?? 0))
    if (monthDiff <= 3) {
      explanations.push(`月柱地支相近，成長背景與價值觀相似，溝通無障礙。`)
    } else {
      explanations.push(`月柱地支相異(${myBazi.month[1]}vs${partnerBazi.month[1]})，思維方式不同，能激發彼此成長。`)
    }
  }

  if (explanations.length < 4) {
    const hourSame = myBazi.hour[1] === partnerBazi.hour[1]
    if (hourSame) {
      explanations.push(`時柱地支相同(${myBazi.hour[1]})，作息與生活節奏一致，日常相處融洽。`)
    } else {
      explanations.push(`時柱地支各異(${myBazi.hour[1]}vs${partnerBazi.hour[1]})，需多預留私人空間。`)
    }
  }

  if (explanations.length < 3) {
    explanations.push(`整體命格展現獨特的互補與差異，珍惜差異就能長久。`)
  }

  return explanations.slice(0, 5)
}

export function calcScore(
  myBazi: BaziResult,
  partnerBazi: BaziResult,
  myWuxing: WuxingScores,
  partnerWuxing: WuxingScores,
): number {
  let score = 50

  const stemDiff = Math.abs(HEAVENLY_STEMS.indexOf(myBazi.year[0]) - HEAVENLY_STEMS.indexOf(partnerBazi.year[0]))
  if (stemDiff === 5) score += 10

  const branchDiff = Math.abs((BRANCH_POSITIONS[myBazi.year[1]] ?? 0) - (BRANCH_POSITIONS[partnerBazi.year[1]] ?? 0))
  if (branchDiff === 4 || branchDiff === 8) score += 8
  if (branchDiff === 6) score -= 5

  const dStemDiff = Math.abs(HEAVENLY_STEMS.indexOf(myBazi.day[0]) - HEAVENLY_STEMS.indexOf(partnerBazi.day[0]))
  if (dStemDiff === 5) score += 10

  if (myBazi.day[1] === partnerBazi.day[1]) score += 8

  const wuxingKeys = ['木', '火', '土', '金', '水'] as const
  let hubu = false
  wuxingKeys.forEach(w => {
    if (myWuxing[w] > 0 && partnerWuxing[w] === 0) hubu = true
    if (partnerWuxing[w] > 0 && myWuxing[w] === 0) hubu = true
  })
  if (hubu) score += 15

  const myTotal = Object.values(myWuxing).reduce((a, b) => a + b, 0)
  const partnerTotal = Object.values(partnerWuxing).reduce((a, b) => a + b, 0)
  if (Math.abs(myTotal - partnerTotal) <= 2) score += 10

  const myStrong = Object.entries(myWuxing).sort((a, b) => b[1] - a[1])[0][0]
  const partnerStrong = Object.entries(partnerWuxing).sort((a, b) => b[1] - a[1])[0][0]
  if (myStrong === partnerStrong) score += 5

  const seed = new Date().getSeconds()
  score += ((seed * 17) % 20) - 10

  return Math.max(1, Math.min(100, Math.round(score)))
}

export function getWuxingConclusion(score: number, myWuxing: WuxingScores, partnerWuxing: WuxingScores): string {
  const myStrong = Object.entries(myWuxing).sort((a, b) => b[1] - a[1])[0][0]
  const partnerStrong = Object.entries(partnerWuxing).sort((a, b) => b[1] - a[1])[0][0]

  if (score >= 80) return `金玉良緣：${myStrong}與${partnerStrong}相生相合，命格天成，堪稱神仙眷侶。`
  if (score >= 60) return `吉緣天成：${myStrong}與${partnerStrong}氣場和諧，攜手今生有望。`
  if (score >= 40) return `中性緣分：${myStrong}與${partnerStrong}各有所長，需要磨合才能長久。`
  return `挑戰緣分：${myStrong}與${partnerStrong}差異明顯，需用心經營方能美滿。`
}

export function getZodiacAnimal(birthDate: string): string {
  const year = new Date(birthDate).getFullYear()
  const baseYear = 1984
  const diff = ((year - baseYear) % 12) + 12
  const animals = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬']
  return animals[diff % 12]
}

export function getMainElement(bazi: BaziResult): string {
  const scores = calcWuxingBalance(bazi.day)
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
}

export function getPersonalityTraits(element: string): string[] {
  const traits: Record<string, string[]> = {
    木: ['創意十足', '意志堅定', '富有同理心', '理想主義', '充滿活力', '善於規劃', '正直可靠', '追求成長'],
    火: ['熱情洋溢', '行動力強', '充滿正能量', '敢愛敢恨', '勇於冒險', '善於表達', '感染力強', '積極進取'],
    土: ['穩重踏實', '忠誠可靠', '善於照顧他人', '腳踏實地', '有責任感', '誠實守信', '務實務實', '包容性強'],
    金: ['果斷有力', '執行力強', '重視承諾', '勇於承擔', '善於分析', '理性冷靜', '有領導力', '講究原則'],
    水: ['聰慧靈活', '適應力強', '直覺敏銳', '善於溝通', '富有智慧', '柔情似水', '洞察人心', '隨機應變'],
  }
  return traits[element] || traits['土']
}

export function getIdealPartnerTraits(myElement: string): string[] {
  const ideal: Record<string, string[]> = {
    木: ['金型特質：果斷有擔當', '水型特質：柔情包容', '特質關鍵詞：事業有成、專一深情、有責任感'],
    火: ['水型特質：柔情似水', '木型特質：溫柔體貼', '特質關鍵詞：成熟穩重、細心呵護、幽默風趣'],
    土: ['金型特質：務實可靠', '火型特質：熱情活力', '特質關鍵詞：居家型、孝順父母、穩重踏實'],
    金: ['木型特質：創意活力', '土型特質：溫柔體貼', '特質關鍵詞：聰明能幹、温柔賢淑、志同道合'],
    水: ['金型特質：理性務實', '火型特質：熱情開朗', '特質關鍵詞：浪漫多情、才華洋溢、善解人意'],
  }
  return ideal[myElement] || ideal['土']
}

export function getLuckyColors(element: string): string[] {
  const colors: Record<string, string[]> = {
    木: ['綠色', '青色', '藍色'],
    火: ['紅色', '紫色', '橙色'],
    土: ['黃色', '棕色', '金色'],
    金: ['白色', '銀色', '金色'],
    水: ['黑色', '藍色', '灰色'],
  }
  return colors[element] || ['金色', '黃色']
}

export function getLoveStyle(myElement: string): string {
  const styles: Record<string, string> = {
    木: '細水長流型：重視精神交流，喜歡用心意傳達溫暖，不善甜言蜜語但行動充滿關懷。',
    火: '轟轟烈烈型：愛情熱情如火，願意為愛付出一切，追求浪漫與刺激，害怕平淡。',
    土: '溫馨穩定型：像避風港一樣的存在，重視家庭和陪伴，愛情日久彌堅。',
    金: '理性金牛型：愛情講究原則，一旦認定便全力以赴，重視承諾與責任感。',
    水: '浪漫夢幻型：愛情像詩一樣美麗，善於營造浪漫氛圍，直覺與情感並重。',
  }
  return styles[myElement] || styles['土']
}

export function getCompatibleItems(element: string): string[] {
  const items: Record<string, string[]> = {
    木: ['翡翠項鍊', '木質手環', '綠色寶石'],
    火: ['紅瑪瑙', '紫水晶', '珊瑚飾品'],
    土: ['黃玉', '琥珀手串', '陶瓷擺件'],
    金: ['白金戒指', '銀飾耳環', '鑽石吊墜'],
    水: ['黑曜石', '藍寶石', '珍珠項鍊'],
  }
  return items[element] || items['土']
}
