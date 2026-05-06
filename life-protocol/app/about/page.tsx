import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於 | Life Protocol",
  description: "了解 Life Protocol — 一套 AI 驅動的人生策略系統。",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        關於 Life Protocol
      </h1>
      <div className="mt-8 space-y-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p>
          Life Protocol
          是一套系統化的人生實踐框架，結合 AI 技術與行為科學，幫助你將
          模糊的人生願景轉化為具體、可追蹤、可迭代的行動方案。
        </p>
        <p>
          不同於一般的代辦清單或goal-setting工具，我們相信真正有效的人生策略需要：
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>清晰的目標層級結構</li>
          <li>符合你價值觀的行動設計</li>
          <li>可衡量的進度指標</li>
          <li>動態調整的迭代機制</li>
        </ul>
        <p>
          Life Protocol 目前仍在積極開發中，Phase 1
          專注於建立核心頁面與用戶體驗框架。敬請期待更多功能的推出。
        </p>
      </div>
      <div className="mt-12 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          開發階段
        </h2>
        <div className="mt-4 space-y-3">
          {[
            { phase: "Phase 0", status: "完成", desc: "Next.js 專案骨架建構" },
            { phase: "Phase 1", status: "進行中", desc: "核心頁面與導航系統" },
            { phase: "Phase 2", status: "待啟動", desc: "用戶輸入與 AI 分析引擎" },
            { phase: "Phase 3", status: "待規劃", desc: "進度追蹤與數據同步" },
          ].map((p) => (
            <div key={p.phase} className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {p.phase}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  p.status === "完成"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : p.status === "進行中"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {p.status}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-500">
                {p.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
