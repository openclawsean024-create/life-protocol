export const metadata = {
  title: "服務條款 | Life Protocol",
  description: "Life Protocol 服務條款 — 使用我們的服務前請先閱讀。",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        服務條款
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        最後更新：2026 年 5 月
      </p>

      <div className="mt-8 space-y-8 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            1. 服務說明
          </h2>
          <p className="mt-2">
            Life Protocol 是一款 AI 驅動的人生策略系統，幫助用戶將模糊的人生願景
            轉化為具體可執行的行動方案。本服務透過網頁應用程式提供。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            2. 使用資格
          </h2>
          <p className="mt-2">
            您必須年滿 13 歲才能使用本服務。使用本服務即表示您聲明並保證
            您具備訂立本合約的法律行為能力。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            3. 帳戶責任
          </h2>
          <p className="mt-2">
            目前 Life Protocol 不需要帳戶即可使用基本功能。若未來引入帳戶系統，
            您有責任維護帳戶資訊的機密性，並對帳戶下的所有活動負責。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            4. 智慧財產權
          </h2>
          <p className="mt-2">
            Life Protocol 的所有內容、設計、原始碼、演算法，均為我們的財產，
            受智慧財產權法保護。您可以分享從服務中獲得的個人見解和策略，
            但不得複製或商業利用我們的專有內容。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            5. 使用規範
          </h2>
          <p className="mt-2">使用本服務時，您同意不：</p>
          <ul className="mt-2 list-disc pl-6 space-y-1">
            <li>將本服務用於任何非法目的</li>
            <li>嘗試未經授權存取系統或他人資料</li>
            <li>干擾或破壞本服務的正常運作</li>
            <li>使用自動化工具大量抓取資料</li>
            <li>修改、改編或破解本服務的任何部分</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            6. 服務變更
          </h2>
          <p className="mt-2">
            我們保留隨時修改、暫停或終止服務（或任何部分）的權利，
            且不對任何修改、暫停或終止對您造成的影響負責。
            我們會盡量提前通知重大變更。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            7. 免責聲明
          </h2>
          <p className="mt-2">
            Life Protocol 是工具，不是醫療或心理諮商替代品。
            本服務按「現狀」提供，不提供任何明示或暗示的保證。
            我們不保證服務會完全無錯誤或不中斷。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            8. 責任限制
          </h2>
          <p className="mt-2">
            在法律允許的範圍內，我們不對任何間接、附帶、特殊或後果性損害負責，
            包括但不限於利潤損失、資料損失、業務中斷等，即使我們已被告知可能發生此類損害。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            9. 終止
          </h2>
          <p className="mt-2">
            您可以隨時停止使用本服務。如果我們認為您違反了任何服務條款，
            我們可能會終止您的存取權限，恕不另行通知。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            10. 適用法律
          </h2>
          <p className="mt-2">
            本服務條款受台灣法律管轄，並依台灣法律解釋。
            如有任何爭議，雙方同意以台灣地方法院為第一審管轄法院。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            11. 聯絡我們
          </h2>
          <p className="mt-2">
            如對本服務條款有任何疑問，請聯絡我們：
            <br />
            電子郵件：support@lifeprotocol.app
          </p>
        </section>
      </div>
    </div>
  );
}
