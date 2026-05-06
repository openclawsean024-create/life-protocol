import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-bold text-zinc-200 dark:text-zinc-800">404</div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        頁面不存在
      </h1>
      <p className="mt-2 max-w-sm text-zinc-500 dark:text-zinc-400">
        抱歉，你訪問的頁面不存在或已被移除。
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          返回首頁
        </Link>
        <Link
          href="/protocol"
          className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          開始 Protocol
        </Link>
      </div>
    </div>
  );
}
