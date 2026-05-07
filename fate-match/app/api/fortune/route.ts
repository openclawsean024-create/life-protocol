import { NextRequest, NextResponse } from 'next/server'
import {
  calcBazi,
  calcWuxingBalance,
  mergeWuxing,
  generateExplanation,
  calcScore,
  getWuxingConclusion,
  getZodiacAnimal,
  getMainElement,
  getPersonalityTraits,
  getIdealPartnerTraits,
  getLuckyColors,
  getLoveStyle,
  getCompatibleItems,
  getSuitableInteractionMode,
} from '@/lib/bazi'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, birthDate, gender, region, shichen } = body

    if (!name || !birthDate) {
      return NextResponse.json({ error: '姓名與生日為必填欄位' }, { status: 400 })
    }

    const bazi = calcBazi(birthDate, shichen !== undefined ? Number(shichen) : undefined)
    const mainElement = getMainElement(bazi)

    // User analysis
    const userWuxing = calcWuxingBalance(bazi.day)
    const personalityTraits = getPersonalityTraits(mainElement)
    const luckyColors = getLuckyColors(mainElement)
    const loveStyle = getLoveStyle(mainElement)

    // Ideal partner traits based on user's element
    const idealPartnerKeywords = getIdealPartnerTraits(mainElement)
    const partnerElement = getComplementaryElement(mainElement)
    const partnerTraits = getPersonalityTraits(partnerElement)

    // Derive partner gender (opposite of user's own gender)
    const userOwnGender = gender === 'male' ? 'female' : 'male'
    const partnerGender = gender === 'female' ? 'female' : 'male'

    // Generate a simulated partner birth date (based on user's bazi and partner gender)
    const simulatedPartnerBirthDate = generateSimulatedPartnerBirthDate(birthDate, mainElement, partnerGender)
    const partnerBazi = calcBazi(simulatedPartnerBirthDate)
    const partnerWuxing = calcWuxingBalance(partnerBazi.day)
    const partnerZodiac = getZodiacAnimal(simulatedPartnerBirthDate)
    const partnerElement2 = getMainElement(partnerBazi)

    // Calculate compatibility
    const combinedWuxing = mergeWuxing(userWuxing, partnerWuxing)
    const score = calcScore(bazi, partnerBazi, userWuxing, partnerWuxing)
    const conclusion = getWuxingConclusion(score, combinedWuxing, combinedWuxing)
    const explanations = generateExplanation(bazi, partnerBazi)

    // Generate radar data
    const radarData = [
      { dimension: '木', myValue: userWuxing['木'], partnerValue: partnerWuxing['木'] },
      { dimension: '火', myValue: userWuxing['火'], partnerValue: partnerWuxing['火'] },
      { dimension: '土', myValue: userWuxing['土'], partnerValue: partnerWuxing['土'] },
      { dimension: '金', myValue: userWuxing['金'], partnerValue: partnerWuxing['金'] },
      { dimension: '水', myValue: userWuxing['水'], partnerValue: partnerWuxing['水'] },
    ]

    const result = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      // User info
      userName: name,
      userBirthDate: birthDate,
      userGender: gender || 'male',
      userRegion: region || '其他',
      userBazi: bazi,
      userElement: mainElement,
      userWuxing,
      userTraits: personalityTraits.slice(0, 10),
      luckyColors,
      loveStyle,
      // Partner info (simulated)
      partnerZodiac,
      partnerBirthDate: simulatedPartnerBirthDate,
      partnerBazi,
      partnerElement: partnerElement2,
      partnerWuxing,
      partnerTraits: partnerTraits.slice(0, 8),
      partnerIdealKeywords: idealPartnerKeywords,
      // Compatibility result
      score,
      wuxingConclusion: conclusion,
      explanation: explanations,
      radarData,
      // Suggested love items
      compatibleItems: getCompatibleItems(mainElement),
      // Interaction mode
      suitableInteractionMode: getSuitableInteractionMode(mainElement, partnerElement2),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Fortune API error:', error)
    return NextResponse.json({ error: '命理分析發生錯誤，請稍後再試' }, { status: 500 })
  }
}

function getComplementaryElement(element: string): string {
  const cycle: Record<string, string> = {
    木: '金',
    金: '火',
    火: '水',
    水: '土',
    土: '木',
  }
  return cycle[element] || '土'
}

function generateSimulatedPartnerBirthDate(userBirthDate: string, userElement: string, partnerGender?: string): string {
  // Generate a plausible partner birth date based on user's bazi
  const userYear = new Date(userBirthDate).getFullYear()
  // Generate a birth year within ±5 years of user's year for plausible pairing
  // Incorporate partnerGender into seed so different genders yield different partner years
  const genderOffset = partnerGender === 'female' ? 3 : partnerGender === 'male' ? 8 : 0
  const seed = (userYear * 7 + userElement.charCodeAt(0) + genderOffset) % 11
  const yearOffset = seed - 5
  const partnerYear = userYear + yearOffset

  // Use the same month/day as user for simplicity
  const date = new Date(userBirthDate)
  const month = date.getMonth() + 1
  const day = date.getDate()

  const maxDay = new Date(partnerYear, month, 0).getDate()
  const actualDay = Math.min(day, maxDay)

  return `${partnerYear}-${String(month).padStart(2, '0')}-${String(actualDay).padStart(2, '0')}`
}
