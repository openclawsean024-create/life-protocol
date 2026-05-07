"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "life_protocol_v1";

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

interface StoredProtocol {
  inputs: Record<number, string>;
  savedAt: string;
}

function loadProtocol(): Record<number, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data: StoredProtocol = JSON.parse(raw);
    return data.inputs || {};
  } catch {
    return {};
  }
}

function saveProtocol(inputs: Record<number, string>): void {
  try {
    const data: StoredProtocol = {
      inputs,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export default function ProtocolPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = loadProtocol();
    if (Object.keys(saved).length > 0) {
      setInputs(saved);
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data: StoredProtocol = JSON.parse(raw);
          if (data.savedAt) {
            setSavedAt(new Date(data.savedAt).toLocaleString("zh-TW"));
          }
        }
      } catch {
        // ignore
      }
    }
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    saveProtocol(inputs);
    setSavedAt(new Date().toLocaleString("zh-TW"));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("確定要清除所有已儲存的內容嗎？")) {
      localStorage.removeItem(STORAGE_KEY);
      setInputs({});
      setSavedAt(null);
    }
  };

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

      {showSaved && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          ✦ 已儲存至瀏覽器
        </div>
      )}

      {savedAt && !showSaved && (
        <div className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-600">
          上次儲存：{savedAt}
        </div>
      )}

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
              <div className="flex items-center justify-between">
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
                    onClick={handleSave}
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

      {isLoaded && Object.keys(inputs).length > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              已輸入內容
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
            >
              清除全部
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {steps.map((step) =>
              inputs[step.id] ? (
                <div key={step.id}>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                    Step {step.id} — {step.title}
                  </span>
                  <p className="mt-0.5 text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                    {inputs[step.id]}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {isLoaded && Object.keys(inputs).length === 0 && (
        <div className="mt-6 text-center text-sm text-zinc-400 dark:text-zinc-600">
          開始填寫，系統會自動儲存至瀏覽器
        </div>
      )}
    </div>
  );
}
