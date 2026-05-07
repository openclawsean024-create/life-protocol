# 命定天子/命定天女 v6.0 — SPEC

## 1. Concept & Vision

地獄級約會神器，結合八字命理與 AI 圖片合成，根據用戶輸入的姓名 / 生日 / 性別 / **居住地區**，推演命定伴侶形象並生成一張「當地人物 + 當地場景」的合成照片。

---

## 2. 方向：地區照片功能完整實裝

核心理念：**「新增輸入居住地區，然後配對的照片，是以當地人的照片」**

用戶選擇居住地區（8大地區）→ 系統生成一張以**當地人照片**為主體、**當地城市夜景**為背景的命定伴侶形象圖。

---

## 3. 8大地區關鍵字手冊

每個地區皆有獨立的：
- **背景搜尋關鍵字**（城市級景點）
- **人物照片關鍵字**（Google Images 搜「當地人」，性別分流）
- **穿著風格關鍵字**（符合當地審美）
- **氛圍/氣質關鍵字**
- **場景描述關鍵字**

| 地區 | 城市級背景關鍵字 | 人物風格 |
|------|-----------------|---------|
| 台灣 | 台北101/西門町/夜市 | 文青、鄰家、溫暖 |
| 香港 | 維多利亞港/中環霓虹/旺角 | 酷感、都會、有型 |
| 中國大陸 | 上海外灘/北京國贸/深圳 | 大氣從容、小姐姐風 |
| 馬來西亞 | 雙峰塔/檳城/馬六甲 | 熱帶活力、多元文化 |
| 新加坡 | 濱海灣金沙/克拉碼頭 | 都市精緻、商務優雅 |
| 日本 | 澀谷十字路口/道頓堀/淺草 | 塩顔、透明感、URAHARA |
| 韓國 | 弘大/江南/明洞 | K-glow、K-fashion、網紅感 |
| 其他 | 亞洲都市夜景（通用） | 普遍吸引力 |

---

## 4. 工作流程

```
用戶輸入
  ├── 姓名
  ├── 生日（YYYY-MM-DD）
  ├── 性別（男/女）
  └── 居住地區（8大地區dropdown）
       ↓
Step 1: Fortune API
  ├── 八字命盤計算
  ├── 五行分析
  ├── 命定伴侶生肖/生日（模擬）
  ├── 緣分分數
  └── 回傳結果（含 userRegion）
       ↓
Step 2: Generate Partner Image API
  ├── (2a) GPT-4o 生成 prompt
  │     └── 地區關鍵字手冊（城市/性別/年齡）注入
  ├── (2b) 圖片生成優先順序
  │     1. Stability AI（完整AI生成）
  │     2. Google Images 當地人物照片（NEW）
  │     3. randomuser.me 隨機人物
  │     4. DiceBear 卡通頭像（最終兜底）
  └── (2c) 背景搜尋
        ├── Google Images 城市夜景搜尋
        └── sharp 圖片合成（人物疊加背景）
             ↓
Step 3: 最終報告呈現
  ├── 命定伴侶形象圖（當地人物 + 當地背景）
  ├── 地區 badge 顯示（📍 地區名）
  ├── 緣分分數
  ├── 八字命盤
  ├── 五行雷達圖
  ├── 命格關鍵字
  ├── 命理深度解說
  └── 分享功能（含地區資訊）
```

---

## 5. API 規格

### POST `/api/fortune`
- Input: `{ name, birthDate, gender, region }`
- Output: FortuneResult（含 `userRegion` 欄位）

### POST `/api/generate-partner-image`
- Input: `{ traits, gender, birthDate, luckyColors, region }`
- Output:
  ```json
  {
    "success": true,
    "imageUrl": "data:image/png;base64,... 或外部URL",
    "promptUsed": "GPT prompt 或本地 prompt",
    "promptSource": "gpt-4o | local",
    "source": "stability_ai | google_local_portrait | randomuser | dicebear",
    "regionNote": "📍 當地XX人物照片（僅 google_local_portrait）"
  }
  ```

---

## 6. 圖片合成邏輯（sharp）

### 人物來源（優先序）
1. **Stability AI** → 直接生成含地區背景的完整圖
2. **Google Images 當地人照片** → 搜尋格式：`[地區] [性別] 25歲 街拍 natural photo`
3. **randomuser.me** → `?seed=[region+birthdate+gender]&gender=[...]`
4. **DiceBear** → SVG 卡通頭像（最終 fallback）

### 背景搜尋（Google Images）
- 格式：`[城市景點] horizontal cityscape night photography`
- 回傳 3 張，隨機取 1
- 若無 API Key → 跳過背景合成

### sharp 合成參數
- 背景：1024×1024，blur(4)，brightness(0.65)，saturation(0.9)
- 人物：680×680 centered，若為外部 URL → 先下載並轉 base64
- 輸出：PNG base64

---

## 7. GPT-4o Prompt System

### 注入的地區特色
- 穿著風格（當地審美）
- 氛圍關鍵字（當地審美）
- 場景描述（城市地標）
- luckyColors → 融入服裝配色

### 輸出格式
```
[Gender] portrait, realistic photography style, soft natural lighting,
[視覺化特質描述],
[髮型描述 + 地區特色],
[地區穿著風格 + luckyColors 配色],
[城市場景背景 + bokeh 燈光],
[地區氛圍關鍵字], intimate close-up shot,
highly detailed, 8k, masterpiece
Negative: ugly, deformed, low resolution, watermark...
```

---

## 8. 頁面呈現

### Input Form
- 姓名（文字輸入）
- 生日（date picker）
- 性別（男/女 toggle）
- **居住地區（8大地區 dropdown）** ← v6.0 新增

### Loading 畫面
- 命盤動畫 + 階段文字
- Phase 1：「✨ 八字命盤分析中...」
- Phase 2：「🎨 AI 命定形象繪製中...」

### Report 報告
- Hero：配對照片（圓形展示）+ 緣分分數
- **地區 badge**（📍 地區名）← v6.0 新增
- 命定結論（八字總結）
- 你的命格分析（八字/五行/五行雷達圖）
- 命定伴侶特質
- 命理深度解說
- 幸運色 & 建議定情物
- 分享（clipboard，含地區資訊）

---

## 9. 環境變數

| 變數 | 用途 | 必要性 |
|------|------|--------|
| `OPENAI_API_KEY` | GPT-4o prompt 生成 | 建議（有 local fallback）|
| `STABILITY_API_KEY` | AI 圖片生成 | 建議（有 randomuser fallback）|
| `GOOGLE_SEARCH_API_KEY` | 地點/背景圖片搜尋 | 建議（有 fallback）|
| `GOOGLE_SEARCH_ENGINE_ID` | Google Search Engine ID | 與上同理 |
| `ENABLE_BACKGROUND_COMPOSITE` | 停用背景合成（'false'） | 預設开启 |

---

## 10. 實作清單

- [x] 使用者輸入居住地區（8大地區）
- [x] GPT-4o Prompt 生成地區特徵描述（含關鍵字手冊注入）
- [x] Google Images 背景搜尋（城市級景點關鍵字）
- [x] sharp 圖片合成（人物 + 背景）
- [x] 最終配對照片呈現（含地區 badge）
- [x] 8大地區關鍵字手冊（城市/性別/年齡）
- [x] **Google Images 當地人物照片搜尋**（NEW: 直接搜尋當地人）
- [x] 外部 URL 轉 base64 後再合成（支援 randomuser.me）
- [x] Fortune API 加入 userRegion 欄位
- [x] 分享功能更新（含地區資訊）
