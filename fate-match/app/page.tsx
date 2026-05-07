'use client'

import { useState, useRef } from 'react'
import { Sparkles, Heart, Star, Clock, Palette, Gift } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// ─── Types ───────────────────────────────────────────────────────────────────

interface FortuneResult {
  id: string
  date: string
  userName: string
  userBirthDate: string
  userGender: string
  userRegion: string
  userBazi: { year: string; month: string; day: string; hour: string }
  userElement: string
  userWuxing: Record<string, number>
  userTraits: string[]
  luckyColors: string[]
  loveStyle: string
  suitableInteractionMode: string
  partnerZodiac: string
  partnerBirthDate: string
  partnerBazi: { year: string; month: string; day: string; hour: string }
  partnerElement: string
  partnerWuxing: Record<string, number>
  partnerTraits: string[]
  partnerIdealKeywords: string[]
  score: number
  wuxingConclusion: string
  explanation: string[]
  radarData: { dimension: string; myValue: number; partnerValue: number }[]
  compatibleItems: string[]
}

interface PartnerImageResult {
  imageUrl: string
  promptUsed: string
  source: string
  partnerName?: string
}

// ─── Consts ───────────────────────────────────────────────────────────────────

const ELEMENT_EMOJI: Record<string, string> = {
  木: '🌳', 火: '🔥', 土: '🌍', 金: '⚪', 水: '💧',
}

const ELEMENT_COLOR: Record<string, string> = {
  木: '#10b981', 火: '#ef4444', 土: '#f59e0b', 金: '#94a3b8', 水: '#3b82f6',
}

// ─── Fortune API ─────────────────────────────────────────────────────────────

async function fetchFortune(name: string, birthDate: string, gender: string, region: string, shichen: number): Promise<FortuneResult> {
  const res = await fetch('/api/fortune', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, birthDate, gender, region, shichen }),
  })
  if (!res.ok) throw new Error('命理分析失敗')
  return res.json()
}

async function fetchPartnerImage(
  traits: string[],
  gender: string,
  birthDate: string,
  luckyColors: string[],
  region: string
): Promise<PartnerImageResult> {
  const res = await fetch('/api/generate-partner-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ traits, gender, birthDate, luckyColors, region }),
  })
  if (!res.ok) throw new Error('圖片生成失敗')
  return res.json()
}

// ─── Loading Component ───────────────────────────────────────────────────────

function LoadingScreen({ phase }: { phase: '分析' | '繪製' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      {/* 命盤動畫 */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-4 border-[#ffd700]/20" />
        <div className="absolute inset-2 rounded-full border-4 border-[#e94560]/30 animate-spin-slow" style={{ borderStyle: 'dashed' }} />
        <div className="absolute inset-4 rounded-full border-4 border-[#ffd700]/40 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '4s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e94560] to-[#ffd700] flex items-center justify-center animate-pulse-glow shadow-lg shadow-[#e94560]/40">
            <Sparkles size={28} className="text-white" />
          </div>
        </div>
        {/* Orbiting dots */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-[#ffd700]"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateY(-80px) rotate(-${deg}deg)`,
              animation: `pulse-glow ${1.5 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          命盤推演中
        </h2>
        <p className="text-[#e94560] text-lg font-medium animate-pulse">
          {phase === '分析' ? '✨ 八字命盤分析中...' : '🎨 AI 命定形象繪製中...'}
        </p>
        <div className="flex gap-2 justify-center mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-[#ffd700]"
              style={{
                animation: `pulse-glow 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Report Component ────────────────────────────────────────────────────────

function ReportSection({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string
  icon: typeof Star
  children: React.ReactNode
  delay?: number
}) {
  return (
    <div
      className="rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-[#ffd700]" />
        <h3 className="text-lg font-bold text-[#ffd700]" style={{ fontFamily: 'var(--font-serif)' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Report({
  result,
  partnerImage,
}: {
  result: FortuneResult
  partnerImage: PartnerImageResult | null
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const scoreColor = result.score >= 80 ? '#10b981' : result.score >= 60 ? '#f59e0b' : result.score >= 40 ? '#e94560' : '#94a3b8'
  const partnerName = partnerImage?.partnerName || `${result.partnerZodiac}年命定之人`

  const chartData = result.radarData.map(d => ({
    name: d.dimension,
    我的五行: d.myValue,
    對方五行: d.partnerValue,
  }))

  const handleShare = () => {
    const text = `命定天子/命定天女 | ${result.userName} 的命理報告（${result.userRegion}）\n\n` +
      `緣分分數：${result.score}分\n` +
      `${result.wuxingConclusion}\n\n` +
      `你的五行：${result.userElement} | 命定對象五行：${result.partnerElement}\n\n` +
      `命盤解說：\n${result.explanation.map(e => `• ${e}`).join('\n')}\n\n` +
      `—— 由 命定天子/命定天女 AI 命理分析`
    navigator.clipboard?.writeText(text).catch(() => {})
    alert('報告已複製到剪貼簿！')
  }

  return (
    <div className="space-y-5 pb-10">
      {/* Hero: AI Photo + Score */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] p-6 text-center border border-white/10">
        {/* Partner AI Image */}
        <div className="relative w-40 h-40 mx-auto mb-4">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 rounded-full bg-[#1a1a2e] flex items-center justify-center">
              <div className="w-full h-full rounded-full animate-pulse bg-gradient-to-br from-[#e94560]/20 to-[#ffd700]/20" />
            </div>
          )}
          {partnerImage?.imageUrl && !imgError ? (
            <img
              src={partnerImage.imageUrl}
              alt="命定伴侶形象"
              className={`w-40 h-40 rounded-full object-cover border-4 border-[#ffd700]/50 shadow-2xl shadow-[#e94560]/30 transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'} absolute inset-0`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true) }}
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#e94560] to-[#ffd700] flex items-center justify-center text-5xl font-black text-white border-4 border-[#ffd700]/50 shadow-2xl shadow-[#e94560]/30">
              {result.partnerZodiac}
            </div>
          )}
          {/* Glow ring */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560] opacity-30 blur-md -z-10 animate-pulse-glow" />
        </div>

        <p className="text-[#ffd700] text-sm mb-1" style={{ fontFamily: 'var(--font-serif)' }}>命定伴侶形象</p>
        <p className="text-white font-bold text-lg mb-4">{partnerName}</p>

        {/* Region badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-white/70 mb-4">
          <span>📍</span>
          <span>{result.userRegion}</span>
        </div>

        {/* Score */}
        <div className="text-7xl font-black mb-1" style={{ color: scoreColor }}>
          {result.score}
        </div>
        <p className="text-white/50 text-sm mb-4">緣分分數</p>

        {/* Score bar */}
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${result.score}%`, background: `linear-gradient(90deg, #e94560, #ffd700)` }}
          />
        </div>
      </div>

      {/* 命定結論 */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-[#ffd700]/20 to-[#e94560]/20 border border-[#ffd700]/30 text-center">
        <p className="text-[#ffd700] font-bold text-base" style={{ fontFamily: 'var(--font-serif)' }}>
          {result.wuxingConclusion}
        </p>
      </div>

      {/* 用戶命格分析 */}
      <ReportSection title="你的命格分析" icon={Star} delay={100}>
        <div className="space-y-3">
          {/* 八字 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: '年柱', value: result.userBazi.year },
              { label: '月柱', value: result.userBazi.month },
              { label: '日柱', value: result.userBazi.day },
              { label: '時柱', value: result.userBazi.hour },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-2 rounded-xl bg-white/5">
                <p className="text-white/40 text-xs mb-1">{label}</p>
                <p className="text-[#ffd700] font-bold text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* 五行屬性 */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <span className="text-3xl">{ELEMENT_EMOJI[result.userElement]}</span>
            <div>
              <p className="text-white font-bold">主五行屬性</p>
              <p className="text-[#ffd700] font-bold text-lg">{result.userElement}</p>
            </div>
            <div className="ml-auto flex gap-1">
              {Object.entries(result.userWuxing).map(([el, val]) => (
                <div key={el} className="text-center">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: `${ELEMENT_COLOR[el]}22`, color: ELEMENT_COLOR[el] }}>
                    {el}
                  </div>
                  <p className="text-xs text-white/50 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 命格關鍵字 */}
          <div>
            <p className="text-white/50 text-xs mb-2">命格關鍵字</p>
            <div className="flex flex-wrap gap-2">
              {result.userTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#ffd700]/10 text-[#ffd700] border border-[#ffd700]/20"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* 五行雷達圖 */}
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <XAxis dataKey="name" tick={{ fill: '#a78bfa', fontSize: 12 }} />
                <YAxis tick={{ fill: '#a78bfa', fontSize: 10 }} domain={[0, 3]} />
                <Tooltip
                  contentStyle={{ background: '#1a1a2e', border: '1px solid #ffd700', borderRadius: 8, color: '#eaeaea', fontSize: 12 }}
                />
                <Bar dataKey="我的五行" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="對方五行" fill="#e94560" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </ReportSection>

      {/* 理想伴侶分析 */}
      <ReportSection title="命定伴侶特質" icon={Heart} delay={200}>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <span className="text-3xl">{ELEMENT_EMOJI[result.partnerElement]}</span>
            <div>
              <p className="text-white font-bold">伴侶主五行</p>
              <p className="text-[#e94560] font-bold text-lg">{result.partnerElement}</p>
            </div>
            <div className="ml-auto text-center">
              <p className="text-white/40 text-xs">生肖</p>
              <p className="text-[#ffd700] font-bold">{result.partnerZodiac}年</p>
            </div>
          </div>

          <div>
            <p className="text-white/50 text-xs mb-2">伴侶命格關鍵字</p>
            <div className="flex flex-wrap gap-2">
              {result.partnerTraits.map((trait, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#e94560]/10 text-[#e94560] border border-[#e94560]/20"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#e94560]/10 rounded-xl p-3 border border-[#e94560]/20">
            <p className="text-white/50 text-xs mb-1">理想伴侶描述</p>
            <p className="text-[#e94560] text-sm">{result.partnerIdealKeywords.join(' | ')}</p>
          </div>
        </div>
      </ReportSection>

      {/* 命理解說 */}
      <ReportSection title="命理深度解說" icon={Clock} delay={300}>
        <div className="space-y-3">
          {result.explanation.map((exp, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-[#ffd700]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#ffd700] text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-[#eaeaea] text-sm leading-relaxed">{exp}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* 愛情模式 */}
      <ReportSection title="你的愛情模式" icon={Heart} delay={400}>
        <p className="text-[#eaeaea] text-sm leading-relaxed">{result.loveStyle}</p>
      </ReportSection>

      {/* 適合的相處模式 */}
      <ReportSection title="適合的相處模式" icon={Star} delay={450}>
        <p className="text-[#eaeaea] text-sm leading-relaxed">{result.suitableInteractionMode}</p>
      </ReportSection>

      {/* 幸運色 & 定情物 */}
      <ReportSection title="幸運色 & 建議定情物" icon={Palette} delay={500}>
        <div className="flex gap-2 mb-3">
          {result.luckyColors.map((color, i) => (
            <span key={i} className="px-4 py-2 rounded-full bg-[#ffd700]/10 text-[#ffd700] font-bold text-sm border border-[#ffd700]/30">
              {color}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {result.compatibleItems.map((item, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/70 border border-white/10 flex items-center gap-1.5">
              <Gift size={12} className="text-[#ffd700]" />{item}
            </span>
          ))}
        </div>
      </ReportSection>

      {/* Share */}
      <button
        onClick={handleShare}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e94560] to-[#ffd700] text-white font-bold text-lg shadow-lg shadow-[#e94560]/30 hover:shadow-xl hover:shadow-[#e94560]/50 transition-all active:scale-[0.98]"
      >
        分享命理報告
      </button>
    </div>
  )
}

// ─── Input Form ──────────────────────────────────────────────────────────────

function InputForm({
  onSubmit,
  loading,
}: {
  onSubmit: (name: string, birthDate: string, gender: string, region: string, shichen: number) => void
  loading: boolean
}) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('male')
  const [region, setRegion] = useState('台灣')
  const [shichen, setShichen] = useState<number>(0) // 0=子, 1=丑, ..., 11=亥
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const SHICHEN_LABELS = [
    { value: 0, label: '子', time: '23:00-00:59' },
    { value: 1, label: '丑', time: '01:00-02:59' },
    { value: 2, label: '寅', time: '03:00-04:59' },
    { value: 3, label: '卯', time: '05:00-06:59' },
    { value: 4, label: '辰', time: '07:00-08:59' },
    { value: 5, label: '巳', time: '09:00-10:59' },
    { value: 6, label: '午', time: '11:00-12:59' },
    { value: 7, label: '未', time: '13:00-14:59' },
    { value: 8, label: '申', time: '15:00-16:59' },
    { value: 9, label: '酉', time: '17:00-18:59' },
    { value: 10, label: '戌', time: '19:00-20:59' },
    { value: 11, label: '亥', time: '21:00-22:59' },
  ]

  function validate() {
    if (!name.trim()) { setError('請輸入姓名'); return false }
    if (!birthDate) { setError('請選擇出生日期'); return false }
    if (birthDate > today) { setError('出生日期不得為未來'); return false }
    setError('')
    return true
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit(name.trim(), birthDate, gender, region, shichen)
  }

  return (
    <div className="space-y-5">
      {/* Hero header */}
      <div className="text-center py-8 px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#e94560] to-[#ffd700] mb-4 shadow-2xl shadow-[#e94560]/40">
          <Sparkles size={36} className="text-white" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          命定天子 / 命定天女
        </h2>
        <p className="text-white/50 text-sm">八字合盤・命理配對・AI 命定形象</p>
      </div>

      {/* Form card */}
      <div className="rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-sm space-y-5">

        {/* Gender toggle */}
        <div>
          <label className="block text-white/60 text-sm mb-2">我想找</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'female', label: '👑 命定天女', sub: '尋找理想女性伴侶' },
              { value: 'male', label: '👑 命定天子', sub: '尋找理想男性伴侶' },
            ].map(({ value, label, sub }) => (
              <button
                key={value}
                onClick={() => setGender(value)}
                className={`p-3 rounded-xl text-center transition-all border ${
                  gender === value
                    ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <p className="font-bold text-sm">{label}</p>
                <p className="text-xs mt-0.5 opacity-70">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-white/60 text-sm mb-2">你的姓名</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="輸入你的姓名"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-[#ffd700]/50 transition-colors"
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-white/60 text-sm mb-2">出生日期</label>
          <input
            type="date"
            value={birthDate}
            max={today}
            onChange={e => setBirthDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ffd700]/50 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Shichen selector */}
        <div>
          <label className="block text-white/60 text-sm mb-2">出生時辰</label>
          <p className="text-white/30 text-xs mb-2">影響時柱，直接關係八字準確度</p>
          <div className="grid grid-cols-4 gap-2">
            {SHICHEN_LABELS.map(({ value, label, time }) => (
              <button
                key={value}
                type="button"
                onClick={() => setShichen(value)}
                className={`p-2 rounded-xl text-center transition-all border text-xs ${
                  shichen === value
                    ? 'border-[#ffd700] bg-[#ffd700]/10 text-[#ffd700]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                }`}
              >
                <div className="font-bold text-base">{label}</div>
                <div className="opacity-60 text-[10px] leading-tight mt-0.5">{time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div>
          <label className="block text-white/60 text-sm mb-2">居住地區</label>
          <p className="text-white/30 text-xs mb-2">為您生成符合當地風格的理想伴侶</p>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#ffd700]/50 transition-colors"
          >
            <option value="台灣">🌏 台灣</option>
            <option value="香港">🌃 香港</option>
            <option value="中國大陸">🏙️ 中國大陸</option>
            <option value="馬來西亞">🌴 馬來西亞</option>
            <option value="新加坡">🏙️ 新加坡</option>
            <option value="日本">🗾 日本</option>
            <option value="韓國">🇰🇷 韓國</option>
            <option value="其他">🌐 其他</option>
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center py-2 bg-red-400/10 rounded-xl">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#e94560] to-[#e94560]/80 text-white font-black text-lg shadow-lg shadow-[#e94560]/30 hover:shadow-xl hover:shadow-[#e94560]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              揭曉命定伴侶
            </>
          )}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-white/20 text-xs px-4">
        本服務僅供娛樂參考，命理分析結果不代表現實感情承諾
      </p>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type Phase = 'input' | 'loading-fortune' | 'loading-image' | 'report'

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>('input')
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [partnerImage, setPartnerImage] = useState<PartnerImageResult | null>(null)

  async function handleSubmit(name: string, birthDate: string, gender: string, region: string, shichen: number) {
    setPhase('loading-fortune')
    setResult(null)
    setPartnerImage(null)

    try {
      const fortuneResult = await fetchFortune(name, birthDate, gender, region, shichen)
      setResult(fortuneResult)
      setPhase('loading-image')

      try {
        const imageResult = await fetchPartnerImage(
          fortuneResult.partnerTraits,
          fortuneResult.userGender,
          fortuneResult.partnerBirthDate,
          fortuneResult.luckyColors,
          region
        )
        setPartnerImage(imageResult)
      } catch {
        // Image generation failed, continue without image
        setPartnerImage(null)
      }

      setPhase('report')
    } catch (err) {
      console.error(err)
      setPhase('input')
      alert('命理分析失敗，請稍後再試')
    }
  }

  function handleReset() {
    setPhase('input')
    setResult(null)
    setPartnerImage(null)
  }

  return (
    <main className="min-h-screen bg-[#16213e]">
      {/* Top gradient bar */}
      <div className="h-2 bg-gradient-to-r from-[#e94560] via-[#ffd700] to-[#e94560]" />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Mobile header */}
        {phase !== 'input' && (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm transition-colors"
            >
              ← 重新測驗
            </button>
            <h1 className="text-sm font-bold text-white/70" style={{ fontFamily: 'var(--font-serif)' }}>
              命定天子 / 命定天女
            </h1>
            <div className="w-16" />
          </div>
        )}

        {/* Phase rendering */}
        {phase === 'input' && (
          <InputForm onSubmit={handleSubmit} loading={phase !== 'input'} />
        )}

        {(phase === 'loading-fortune' || phase === 'loading-image') && (
          <LoadingScreen phase={phase === 'loading-fortune' ? '分析' : '繪製'} />
        )}

        {phase === 'report' && result && (
          <Report result={result} partnerImage={partnerImage} />
        )}
      </div>
    </main>
  )
}
