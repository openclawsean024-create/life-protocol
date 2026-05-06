import Link from "next/link";

const features = [
  {
    icon: "🎯",
    title: "目標設定",
    description: "系統化梳理你的人生願景，建立清晰可行的行動藍圖",
  },
  {
    icon: "🧭",
    title: "策略引導",
    description: "AI 驅動的分析引擎，幫助你找到最佳實踐路徑",
  },
  {
    icon: "📊",
    title: "進度追蹤",
    description: "即時掌握實踐進度，保持動力的持續反饋系統",
  },
  {
    icon: "🔄",
    title: "迭代優化",
    description: "根據執行情況動態調整，讓策略始終符合實際",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-200 via-white to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950" />
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          系統建設中 · Phase 1
        </div>
        <h1 className="mt-6 max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          用系統的方法，
          <br />
          <span className="text-zinc-500 dark:text-zinc-400">實踐你的人生</span>
        </h1>
        <p className="mt-6 max-w-md text-base text-zinc-600 dark:text-zinc-400">
          Life Protocol 是一套 AI 驅動的人生策略系統，幫助你將模糊的願景轉化為
          具體可執行的行動方案。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/protocol"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            開始制訂 Protocol
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            了解更多
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              為什麼需要 Life Protocol？
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              大多數人缺乏的不是動力，而是系統
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            準備好開始了嗎？
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            從今天起，用有結構的方式實踐你的人生策略
          </p>
          <Link
            href="/protocol"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            建立你的第一個 Protocol
          </Link>
        </div>
      </section>
    </div>
  );
}