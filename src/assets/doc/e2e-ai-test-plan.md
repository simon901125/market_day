# AI 輔助 E2E 測試規劃

## 一、文件目的

本文件說明 Market Day 前端專案的 Playwright E2E 測試現況、執行方式、測試資料策略與後續規劃。

E2E（End-to-End）測試會從使用者操作的前端畫面開始，經過 Angular、Spring Boot API 與資料庫，驗證完整流程是否能正確完成。例如：

```text
進入主辦方登入頁
→ 輸入 Email 與密碼
→ 呼叫登入 API
→ 儲存登入狀態
→ 進入主辦方後台
```

本階段優先處理主辦方帳號生命週期，再逐步擴充到活動建立、報名、審核、付款與攤位管理。

## 二、目前完成狀態

### 已完成

- 已安裝 `@playwright/test` 與 Chromium。
- 已建立 `playwright.config.ts`。
- 已建立 `e2e/` 測試目錄。
- 已設定 Angular 前端自動啟動於 `http://localhost:4200`。
- 已設定後端 API 使用 `http://localhost:8081`。
- 已支援 Headed、UI Mode、HTML Report、Trace、失敗截圖與失敗影片。
- Chromium 執行測試時會最大化，並停用翻譯提示。
- 測試固定使用一個 worker，案例依序執行，方便展示。
- 已完成主辦方登入成功與錯誤密碼兩個案例。

### 尚未完成

- 主辦方註冊與 Email 驗證。
- 忘記密碼、驗證碼與重設密碼。
- 首次登入與主辦方資料填寫。
- Google 帳號綁定。
- 登入後修改密碼。
- 註銷帳號。
- 測試資料自動建立、還原與清除機制。

目前測試檔：

```text
e2e/
└── organizer-login.spec.ts
```

## 三、專案環境

| 項目 | 設定 |
| --- | --- |
| 前端 | Angular，`http://localhost:4200` |
| 後端 | Spring Boot，`http://localhost:8081` |
| 測試工具 | Playwright Test |
| 測試瀏覽器 | Chromium |
| 測試目錄 | `e2e/` |
| 設定檔 | `playwright.config.ts` |
| 本機測試資料 | `.env.e2e.local` |

Playwright 會由 `webServer` 自動執行 `npm start`，因此執行 E2E 時通常只需要另外啟動 Spring Boot 後端。

## 四、組員安裝方式

合併或拉取含 Playwright 的版本後，在前端專案根目錄執行：

```powershell
npm install
npx playwright install chromium
```

一般情況不需要刪除 `node_modules`。若本機依賴異常，可乾淨重裝：

```powershell
Remove-Item -Recurse -Force node_modules
npm ci
npx playwright install chromium
```

## 五、本機環境變數

在前端專案根目錄建立 `.env.e2e.local`：

```env
E2E_ORGANIZER_EMAIL=主辦方測試信箱
E2E_ORGANIZER_PASSWORD=主辦方測試密碼
PW_SLOW_MO=1500
PW_UI_SLOW_MO=300
```

設定用途：

| 變數 | 用途 |
| --- | --- |
| `E2E_ORGANIZER_EMAIL` | 一般主辦方登入測試帳號 |
| `E2E_ORGANIZER_PASSWORD` | 一般主辦方登入測試密碼 |
| `PW_SLOW_MO` | Headed 展示模式每個操作的延遲毫秒數 |
| `PW_UI_SLOW_MO` | UI Mode 每個操作的延遲毫秒數 |

`.env.e2e.local` 不可提交到 Git。每位組員應建立自己的本機檔案，並使用專用測試帳號，不可放入個人或正式環境密碼。

## 六、執行指令

### 背景執行全部 E2E

```powershell
npm run e2e
```

### 顯示瀏覽器執行全部 E2E

```powershell
npm run e2e:headed
```

### 開啟 Playwright UI Mode

```powershell
npm run e2e:ui
```

### 只執行主辦方登入測試

```powershell
npm run e2e:headed -- organizer-login.spec.ts
```

### 只執行登入成功案例

```powershell
npm run e2e:headed -- organizer-login.spec.ts -g "使用正確帳密"
```

### 查看 HTML 報告

```powershell
npm run e2e:report
```

## 七、目前已實作案例：主辦方登入

測試檔：`e2e/organizer-login.spec.ts`

### 案例 1：使用正確帳密登入

前置條件：

- 主辦方帳號已存在。
- Email 已完成驗證。
- 帳號狀態為啟用。
- `.env.e2e.local` 已設定正確帳密。
- Spring Boot 已啟動於 Port `8081`。

測試流程：

1. 進入 `/organizer/login`。
2. 輸入正確 Email 與密碼。
3. 點擊「登入」。
4. 等待 `POST /api/organizer/local-login` 回應。
5. 確認網址進入 `/organizer/dash-board/home`。

預期結果：登入成功並顯示主辦方後台。

### 案例 2：使用錯誤密碼登入

測試流程：

1. 進入 `/organizer/login`。
2. 輸入有效的主辦方 Email。
3. 輸入測試程式指定的錯誤密碼。
4. 點擊「登入」。
5. 確認 SweetAlert 顯示「登入失敗」及帳密錯誤訊息。
6. 確認仍停留在 `/organizer/login`。

預期結果：使用者無法進入後台，但此 E2E 案例應判定為通過，因為系統正確阻擋錯誤密碼。

## 八、主辦方帳號生命週期測試規劃

| 編號 | 測試流程 | 建議測試檔 | 資料影響 | 規劃狀態 |
| --- | --- | --- | --- | --- |
| O-01 | 主辦方註冊 | `organizer-register.spec.ts` | 建立新帳號 | 待實作 |
| O-02 | 主辦方登入 | `organizer-login.spec.ts` | 建立登入狀態 | 已完成 |
| O-03 | 忘記密碼 | `organizer-forgot-password.spec.ts` | 產生驗證碼、修改密碼 | 待實作 |
| O-04 | 首次登入引導 | `organizer-first-login.spec.ts` | 需要未填資料帳號 | 待實作 |
| O-05 | 主辦方資料填寫 | `organizer-profile.spec.ts` | 寫入主辦方資料 | 待實作 |
| O-06 | Google 帳號綁定 | `organizer-google-bind.spec.ts` | 綁定後目前無法解除 | 待實作 |
| O-07 | 登入後修改密碼 | `organizer-password.spec.ts` | 改變登入密碼 | 待實作 |
| O-08 | 註銷帳號 | `organizer-deactivate.spec.ts` | 永久停用帳號 | 待實作、破壞性 |

### O-01 主辦方註冊

流程：

```text
進入 /organizer/register
→ 填寫負責人姓名、Email、密碼、確認密碼
→ 送出註冊
→ 確認呼叫 POST /api/organizer/local-register
→ 顯示驗證碼已寄出
→ 進入 /organizer/verify-email
→ 輸入 6 位數驗證碼
→ 完成 Email 驗證
```

資料策略：每次測試必須使用唯一 Email，例如加上時間戳記。若重複使用同一 Email，第二次執行會得到「Email 已註冊」。

自動化限制：後端目前會寄送真實 Email，尚未提供 E2E 專用驗證碼查詢介面。完整自動化需具備下列其中一項：

- 可由程式讀取的測試信箱。
- MailHog、Mailpit 等本機測試郵件服務。
- 僅測試環境開放的驗證碼取得 API。

在取碼機制完成前，可先自動測到「進入驗證碼頁」。

### O-03 忘記密碼

流程：

```text
進入 /organizer/forgot-password
→ 輸入主辦方 Email
→ 呼叫 POST /api/auth/resetPassword/request
→ 進入驗證碼頁
→ 驗證 6 位數驗證碼
→ 取得 reset token
→ 設定新密碼
→ 使用新密碼登入
```

忘記密碼同樣需要可由測試程式取得驗證碼。建議使用專用帳號，測試結束後將密碼改回原值；若中途失敗，需記錄目前有效密碼以避免後續登入案例全部失敗。

### O-04 首次登入引導

前置條件：主辦方帳號已啟用，但尚未完成主辦方資料。

流程：

```text
登入
→ 進入 /organizer/dash-board/home
→ dashboard init 回傳 needsProfile=true
→ 顯示「完成首次設定」與「設定主辦方資料」
→ 受限制的側邊欄功能不可直接使用
```

首次登入不可長期共用一般測試帳號，因為完成資料填寫後 `needsProfile` 會變成 `false`，下次就不再是首次登入狀態。

### O-05 主辦方資料填寫

流程：

```text
首次登入引導
→ 點擊「前往設定」
→ 填寫主辦方名稱、聯絡人、電話、Email
→ 選擇縣市與行政區
→ 填寫地址
→ 選擇服務星期與服務時間
→ 呼叫 POST /api/organizer/profile/save
→ 顯示儲存成功
→ 解鎖主辦方後台功能
```

必要欄位：

- 主辦方名稱。
- 聯絡人。
- 聯絡電話。
- 聯絡電子郵件。
- 縣市、行政區與地址。
- 至少一個服務星期。
- 正確的服務開始與結束時間。

公司／團體名稱與統一編號為選填；若填寫統一編號，必須是 8 碼數字。

### O-06 Google 帳號綁定

流程：

```text
登入本地帳號
→ 開啟帳號設定
→ 點擊「前往綁定」
→ 完成 Google 身分驗證
→ 呼叫 POST /api/auth/google-bind
→ 顯示綁定成功
→ 帳號狀態顯示「已綁定」
```

Google OAuth 容易受到登入狀態、2FA、彈窗與 Google 安全機制影響，不適合在一般 CI 直接操作真實個人 Google 帳號。建議：

- 使用專用 Google 測試帳號做人工／展示測試。
- 自動化測試使用測試環境的 Google credential stub。
- Google 綁定帳號必須獨立，因為目前沒有解除綁定功能。

### O-07 登入後修改密碼

流程：

```text
登入
→ 開啟帳號設定
→ 點擊「修改密碼」
→ 輸入目前密碼、新密碼與確認新密碼
→ 呼叫密碼修改 API
→ 顯示密碼更新成功
→ 登出
→ 使用新密碼重新登入
→ 測試結束後改回原密碼
```

注意：目前前端畫面雖要求輸入「目前密碼」，實際送往後端的 payload 只包含新密碼。此項應列為安全性驗證與待改善事項，完成後端目前密碼驗證後再補完整 E2E。

### O-08 註銷帳號

流程：

```text
使用註銷專用帳號登入
→ 開啟帳號設定
→ 點擊「申請註銷帳號」
→ 確認註銷
→ 呼叫 POST /api/account/deactivate
→ 清除登入狀態
→ 返回 /organizer/login
→ 再次登入應被拒絕
```

此案例是破壞性測試，執行後帳號永久停用。不可使用一般登入帳號，且不可放在預設的全部測試中。建議加上 `@destructive` 標籤並明確指定才執行：

```powershell
npm run e2e:headed -- -g "@destructive"
```

## 九、測試帳號與資料隔離策略

不能安全地讓所有流程長期共用同一個帳號，因為不同案例會改變不可逆或難以還原的狀態。

| 帳號用途 | 必要狀態 | 是否可重複使用 |
| --- | --- | --- |
| 一般登入帳號 | 已驗證、已啟用、密碼固定 | 可以 |
| 首次登入帳號 | 已驗證、未填主辦方資料 | 填資料前可以 |
| 資料填寫帳號 | 已驗證、允許覆寫測試資料 | 可以，但需控制資料 |
| Google 綁定帳號 | 本地帳號、尚未綁定 Google | 綁定前可以 |
| 密碼修改帳號 | 已知目前密碼 | 可以，但需改回原密碼 |
| 註銷帳號 | 無進行中活動、狀態為啟用 | 只能成功註銷一次 |
| 註冊帳號 | Email 尚未存在 | 每次使用唯一 Email |

長期最佳做法是在後端增加 E2E 測試資料工具：

1. 測試前建立指定狀態的帳號。
2. 測試中只操作該次建立的資料。
3. 測試後清除帳號或還原狀態。
4. 測試資料工具只允許在本機或測試環境使用，正式環境必須關閉。

## 十、測試安全與 Git 管理

Playwright HTML Report 可能記錄 `fill()` 的輸入值，因此報告、Trace、影片、截圖與 `.env.e2e.local` 都不可提交敏感資料。

`.gitignore` 應包含：

```gitignore
.env.e2e.local
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

目前 `.env.e2e.local` 與 `playwright-report/index.html` 曾被 Git 追蹤；僅加入 `.gitignore` 不會取消已追蹤檔案。應執行：

```powershell
git rm --cached .env.e2e.local
git rm --cached playwright-report/index.html
git commit -m "chore: stop tracking local e2e files"
```

若測試密碼曾進入 Git 或 Playwright Report，應立即更換該測試帳號密碼。正式帳號與個人帳號不可作為 E2E 測試帳號。

## 十一、測試分階段規劃

### 第一階段：基礎建置（已完成）

- 安裝 Playwright 與 Chromium。
- 建立設定檔與執行指令。
- 完成主辦方登入成功／失敗案例。
- 建立 UI Mode 與展示模式。

### 第二階段：主辦方帳號流程

- 註冊送出與驗證碼頁。
- 忘記密碼送出與驗證碼頁。
- 首次登入引導。
- 主辦方資料填寫。
- 密碼修改與還原。
- Google 綁定測試替身。
- 獨立的註銷帳號案例。

### 第三階段：郵件與測試資料自動化

- 建立可程式讀取的測試信箱或本機郵件服務。
- 自動取得註冊與忘記密碼驗證碼。
- 建立測試帳號 seed／cleanup 工具。
- 將破壞性案例與一般案例分開。

### 第四階段：核心商業流程

```text
主辦方建立活動
→ 管理員審核
→ 主辦方發布活動
→ 攤主報名
→ 主辦方審核報名
→ 攤主付款與選位
→ 活動結束與後續帳務
```

優先案例：

- 活動建立與發布。
- 攤主報名成功。
- 重複報名阻擋。
- 報名審核不通過。
- 報名截止後禁止報名。
- 付款與攤位選擇。

## 十二、完成標準

每個 E2E 案例至少需要符合：

1. 前置資料明確且可準備。
2. 測試可判斷成功與失敗結果。
3. 不依賴測試執行順序，或已明確標示序列流程。
4. 失敗時保留足以除錯的報告、截圖或 Trace。
5. 不將帳密、Token、驗證碼與測試報告提交至 Git。
6. 破壞性案例必須使用獨立帳號並由明確指令觸發。
7. 測試可重跑；若無法重跑，文件必須說明還原方式。

## 十三、目前結論

Playwright 基礎環境與主辦方登入案例已完成，可以用 Headed 或 UI Mode 展示。下一步應優先完成「首次登入引導」與「主辦方資料填寫」，因為這兩項不依賴 Email 驗證碼或真實 Google OAuth；同時規劃測試信箱與測試資料建立／清除機制，才能讓註冊、忘記密碼、Google 綁定、密碼修改與註銷流程穩定且可重複執行。
