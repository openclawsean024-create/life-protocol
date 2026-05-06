"use client";

import { useState } from "react";

const steps = [
  {
    id: 1,
    title: "定義你的北極星",
    description: "思考你人生中最重要的一個方向或終極目標。它不需要具體，但必須對你有意義。",
    placeholder: "例如：成為領域內最有影響力的人...",
  },
  {
    id: 2,
    title: "拆解關鍵領域",
    description: "哪些生活領域需要兼顧才能實現這個目標？、健康、關係、事業、學習...",
    placeholder: "例如：健康、關係、事業、財務、學習...",
  },
  {
    id: 3,
    title: "設定原則",
    description: "為每個領域訂下 1-2 個核心原則。這些原則會在遇到困難時指引你的選擇。",
    placeholder: "例如：健康的核心原則是「能量優先」...",
  },
];

export default function ProtocolPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [inputs, setInputs] = useState<Record<number, string>>({});

  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          建立你的 Protocol
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          三步式系統，幫助你梳理人生策略的核心框架
        </p>
      </div>

      {/* Step indicators */}
      <div className="mt-10 flex items-center justify-center gap-2">
        {steps.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(s.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              activeStep === s.id
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {s.id}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        {steps.map((step) =>
          activeStep === step.id ? (
            <div key={step.id} className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {step.id}. {step.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
              <textarea
                value={inputs[step.id] || ""}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, [step.id]: e.target.value }))
                }
                placeholder={step.placeholder}
                rows={4}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
                  disabled={activeStep === 1}
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  上一步
                </button>
                {activeStep < steps.length ? (
                  <button
                    onClick={() => setActiveStep((s) => Math.min(steps.length, s + 1))}
                    className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    下一步
                  </button>
                ) : (
                  <button
                    onClick={() => alert("生命Protocol儲存成功！")}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
                  >
                    儲存 Protocol
                  </button>
                )}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Summary */}
      {Object.keys(inputs).length > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            已輸入內容
          </h3>
          <div className="mt-3 space-y-3">
            {steps.map((step) =>
              inputs[step.id] ? (
                <div key={step.id}>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                    Step {step.id} — {step.title}
                  </span>
                  <p className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-200">
                    {inputs[step.id]}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
