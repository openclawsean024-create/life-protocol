# PTT Alertor — 環境變數 + reinspect 回報
**時間:** 2026-04-21 06:01 GMT+8

## 環境變數狀態（vercel env ls）
| 變數 | 狀態 | 備註 |
|------|------|------|
| NEXTAUTH_SECRET | ✅ 已設定 | Production, encrypted, 23h ago |
| NEXTAUTH_URL | ✅ 已設定 | Production, encrypted, 23h ago |
| DATABASE_URL | ⚠️ 已新增 | Production, encrypted, **但值為測試假URL**，需 Sean 替換為真正的 Neon DB 連線字串 |
| NEXT_PUBLIC_BYPASS_AUTH | ✅ 已設定 | Production, encrypted, 7d ago |

## reinspect 結果
- `/` → HTTP 200 ✅
- `/subscribe` → HTTP 200 ✅
- `/dashboard` → HTTP 200 ✅
- `/sign-in` → HTTP 404 ❌
- `/api/auth/session` → HTTP 404 ❌
- `/api/subscriptions/anonymous` POST → HTTP 500（DATABASE_URL 為假值）

## 重大發現：NextAuth route handler 缺失

NextAuth v5（beta）用以下方式 export handlers：
```ts
export const { handlers, auth, signIn, signOut } = NextAuth({...})
```

**問題：專案中完全缺少 `app/api/auth/[...nextauth]/route.ts`**，導致：
- `/sign-in` 404（NextAuth pages 配置了 `signIn: '/sign-in'` 但沒有 handler）
- `/api/auth/*` 全部 404

另外 `app/sign-in/` 和 `app/sign-up/` 目錄存在但**完全是空的**（沒有 `page.tsx`）。

## 需要 Sean 手動處理

1. 🔴 **最優先**：Vercel Dashboard 將 `DATABASE_URL` 替換為真正的 Neon DB 連線字串
2. 🔴 **次優先**：建立 `app/api/auth/[...nextauth]/route.ts`：
   ```ts
   export { handlers as GET, handlers as POST } from '@/lib/auth'
   ```
3. 🔴 建立 `app/sign-in/page.tsx` 登入表單頁面
4. 執行 `npm run db:setup` 套用資料庫 schema（如尚未執行）

## 回報對象
DVA cron session: `agent:dva:cron:a28d05b2-c531-494a-9b27-ea1f10d42149`
（subagent sessions_send 遭遇 API rate limit，改寫入此檔案）