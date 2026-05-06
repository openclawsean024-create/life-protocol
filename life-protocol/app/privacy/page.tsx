export const metadata = {
  title: "隱私權政策 | Life Protocol",
  description: "Life Protocol 隱私權政策 — 了解我們如何收集、使用和保護您的資料。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        隱私權政策
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        最後更新：2026 年 5 月
      </p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            1. 資料收集
          </h2>
          <p className="mt-2">
            Life Protocol 重視您的隱私。我們收集的資料僅用於提供和改進服務。
            當您使用 Life Protocol 時，我們可能會收集：
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>您主動輸入的內容（如早晨宣言、願景陳述、身份認同）</li>
            <li>使用習慣與互動資料（以改善產品體驗）</li>
            <li>設備資訊（如瀏覽器類型、作業系統）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            2. 資料儲存
          </h2>
          <p className="mt-2">
            所有您輸入的資料預設儲存在本機（localStorage）。我們目前尚未使用雲端資料庫，
            因此您的資料不會離開您的設備。我們計劃在未來提供雲端同步功能，屆時會另行通知並取得您的同意。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            3. 資料使用
          </h2>
          <p className="mt-2">
            我們使用收集的資料來：
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>提供個人化的每日 Protocol 引導</li>
            <li>追蹤您的進度、等級和連續天數</li>
            <li>改善產品功能與使用者體驗</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            4. 資料分享
          </h2>
          <p className="mt-2">
            我們不會出售、交易或轉讓您的個人識別資訊給外部第三方。
            我們可能會使用第三方服務（如 Vercel）來托管網站，這些服務有自己的隱私權政策。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            5. 資料安全
          </h2>
          <p className="mt-2">
            我們採用業界標準的安全措施來保護您的資料，包括加密傳輸（HTTPS）
            和安全的伺服器托管環境。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            6. 您的權利
          </h2>
          <p className="mt-2">
            您可以隨時匯出或刪除您的資料。由於資料目前儲存在本機，
            您可以透過清除瀏覽器資料來刪除所有資料。未來雲端同步功能上線後，
            我們將提供更完整的資料管理選項。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            7. 兒童隱私
          </h2>
          <p className="mt-2">
            Life Protocol 不面向 13 歲以下的兒童，我們不會故意收集兒童的個人資訊。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            8. 政策變更
          </h2>
          <p className="mt-2">
            我們可能會不時更新此隱私權政策。任何重大變更都會在本頁面上公告，
            並更新「最後更新」日期。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            9. 聯絡我們
          </h2>
          <p className="mt-2">
            如果您對本隱私權政策有任何疑問，歡迎透過以下方式聯絡我們：
            <br />
            電子郵件：support@lifeprotocol.app
          </p>
        </section>
      </div>
    </div>
  );
}
