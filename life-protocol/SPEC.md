# Life Protocol - 規格文件

## Overview
Life Protocol 實踐應用 - AI 驅動的人生策略系統
以 Next.js App Router 建構所開發的人生策略引導系統。

## Current Status
- Phase 0: ✅ Next.js 骨架完成（create-next-app）
- Phase 1: ✅ 核心頁面完成
  - ✅ App Shell（Header + Footer + ThemeProvider）
  - ✅ 首頁（Hero + Features + CTA）
  - ✅ 關於頁面（系統介紹 + 開發階段）
  - ✅ Protocol 頁面（3步引導 + localStorage 持久化）
  - ✅ 隱私權政策 / 服務條款
  - ✅ 響應式設計

## Phase 1: 核心頁面與佈局

### 1.1 應用程式殼層 (App Shell)
- [x] 設定 metadata（標題、描述、favicon）
- [x] 設計響應式導航列（Header）
- [x] 設計頁尾（Footer）
- [x] 支援明/暗主題切換

### 1.2 首頁 (Home Page)
- [x] Hero 區塊 - 系統名稱與 tagline
- [x] 功能概覽卡片
- [x] 快速開始按鈕
- [x] 特色說明區塊

### 1.3 關於頁面 (About Page)
- [x] 系統介紹
- [x] 團隊/開發者資訊

### 1.4 其他頁面
- [x] Protocol 頁面（3步引導流程 + localStorage 持久化）
- [x] 隱私權政策頁面
- [x] 服務條款頁面

## Phase 2: 核心功能（待規劃）
- 用戶輸入系統
- AI 分析引擎
- 個人化策略生成
- 進度追蹤儀表板

## Phase 3: 進階功能（待規劃）
- 多設備同步
- 數據導出
- API 整合

## Tech Stack
- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase（身份驗證與數據）
- Zod（驗證）
- React Hook Form

## 部署
- Vercel: https://life-protocol-7gi98fjic-seans-projects-7dc76219.vercel.app
- GitHub: https://github.com/openclawsean024-create/life-protocol
