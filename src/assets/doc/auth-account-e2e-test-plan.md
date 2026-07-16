# Market Day 帳號 E2E 測試計畫

最後更新：2026-07-15

## 1. 文件範圍

本文件管理攤主（Vendor）、主辦方（Organizer）與管理員（Admin）的帳號 E2E 測試進度。

共用安裝方式、執行指令與撰寫規範請參考 [E2E 測試共用指南](./e2e-ai-test-plan.md)。

帳號功能以最小 Smoke 為完成範圍，不追求所有欄位與錯誤狀態排列組合。攤主與主辦方的首次登入引導、角色資料填寫不屬於本文件範圍。跨角色的活動建立、審核、報名、付款及選位則由全專案活動主流程測試計畫管理。

## 2. 角色與支援功能

| 功能 | 攤主 | 主辦方 | 管理員 |
| --- | --- | --- | --- |
| 本地註冊 | 支援 | 支援 | 不支援，由系統建立 |
| Email 驗證 | 支援 | 支援 | 不適用 |
| 本地登入 | 支援 | 支援 | 支援 |
| Google 註冊／登入 | 支援 | 支援 | 不支援 |
| 忘記／重設密碼 | 支援 | 支援 | 目前無前端流程 |
| Google 綁定 | 支援 | 支援 | 不支援 |
| 登入後修改密碼 | 支援 | 支援 | 目前無前端流程 |
| 登出 | 支援 | 支援 | 支援 |
| Session 與角色權限 | 支援 | 支援 | 支援 |
| 註銷帳號 | 支援 | 支援 | 不支援或由系統管理 |

## 3. 測試編號

| 編號 | 功能 | 適用角色 | 測試分類 |
| --- | --- | --- | --- |
| AUTH-01 | 本地註冊 | 攤主、主辦方 | Smoke |
| AUTH-02 | Email 驗證 | 攤主、主辦方 | Smoke／Email 整合 |
| AUTH-03 | 本地登入 | 三種角色 | Smoke |
| AUTH-04 | 忘記與重設密碼 | 攤主、主辦方 | Smoke |
| AUTH-05 | Google 註冊與登入 | 攤主、主辦方 | Smoke／OAuth Stub |
| AUTH-06 | Google 帳號綁定 | 攤主、主辦方 | Smoke／OAuth Stub |
| AUTH-07 | 登入後修改密碼 | 攤主、主辦方 | Smoke |
| AUTH-08 | 登出 | 三種角色 | Smoke |
| AUTH-09 | Session 與角色權限 | 三種角色 | Smoke |
| AUTH-10 | 註銷帳號 | 攤主、主辦方 | Destructive |

## 4. 狀態定義

| 狀態 | 定義 |
| --- | --- |
| 已完成 | Smoke 已實際執行，Real API 或 Auth Guard 驗證已通過 |
| 已完成 UI Smoke | 使用 API／Google Stub 驗證前端，不代表真實外部整合成功 |
| 已完成 Destructive | 使用一次性帳號執行真實不可逆操作並通過 |
| 待實作 | 測試檔尚未建立 |
| 受前置條件阻擋 | 缺少測試郵件、OAuth Stub、一次性帳號或正確 API 契約 |
| 不適用 | 該角色不支援此功能 |

## 5. 三種角色目前進度

| 編號 | 攤主 | 主辦方 | 管理員 |
| --- | --- | --- | --- |
| AUTH-01 本地註冊 | 已完成 UI Smoke | 已完成 UI Smoke | 不適用 |
| AUTH-02 Email 驗證 | 受測試郵件阻擋 | 受測試郵件阻擋 | 不適用 |
| AUTH-03 本地登入 | 已完成，1 個 Real API Smoke | 已完成，2 個 Real API Smoke | 已完成，1 個 Real API Smoke |
| AUTH-04 忘記與重設密碼 | 已完成 UI Smoke | 已完成 UI Smoke | 不適用 |
| AUTH-05 Google 註冊與登入 | 已完成 UI Smoke | 已完成 UI Smoke | 不適用 |
| AUTH-06 Google 帳號綁定 | 已完成 UI Smoke | 已完成 UI Smoke | 不適用 |
| AUTH-07 登入後修改密碼 | E2E 已實作，待後端與資料庫啟動後實跑 | E2E 已實作，待後端與資料庫啟動後實跑 | 不適用 |
| AUTH-08 登出 | 已完成，1 個 Real API Smoke | 已完成，1 個 Real API Smoke | 已完成，1 個 Real API Smoke |
| AUTH-09 Session 與角色權限 | 已完成，1 個 Auth Guard Smoke | 已完成，1 個 Auth Guard Smoke | 已完成，1 個 Auth Guard Smoke |
| AUTH-10 註銷帳號 | E2E 已實作，待一次性帳號實跑 | E2E 已實作，待一次性帳號實跑 | 不適用 |

## 6. 目前已完成測試

### 本地註冊

測試檔：`e2e/auth-register.spec.ts`

- 攤主、主辦方的註冊案例寫在同一支測試檔。
- 使用 API Stub 驗證送出的角色 endpoint、姓名、Email 與密碼 payload。
- 驗證註冊成功提示、待驗證 Email 的 SessionStorage 與 Email 驗證頁導向。
- 不會建立真實待驗證帳號，也不代表後端寄信整合已通過。

### 本地登入

測試檔：`e2e/auth-login.spec.ts`

- 攤主、主辦方、管理員的正確帳密登入案例寫在同一支測試檔。
- 使用各角色真實 `POST /api/{role}/local-login`。
- 成功時檢查 `statusCode`、角色、Token、使用者資料與後台網址。
- 保留主辦方錯誤密碼案例，檢查錯誤訊息並停留登入頁。
- 三種角色的正確帳密登入均已通過，主辦方錯誤密碼案例也已通過。

### 忘記密碼

測試檔：`e2e/auth-forgot-password.spec.ts`

- 攤主、主辦方的忘記密碼案例寫在同一支測試檔。
- 使用 API Stub 驗證送往 `/api/auth/resetPassword/request` 的 Email payload。
- 驗證成功提示、重設密碼 Email 的 SessionStorage 與 `purpose=reset` 驗證頁導向。
- 不代表真實寄信、驗證碼或最終密碼重設整合已通過。

### 登出

測試檔：`e2e/auth-logout.spec.ts`

- 三種角色的登出案例寫在同一支測試檔。
- 使用真實 `POST /api/auth/logout`。
- 檢查 API `statusCode`、登入頁網址及 localStorage Session 清除。
- 三種角色的登出案例均已通過。

### Session 與後台權限

測試檔：`e2e/auth-session-access.spec.ts`

- 分別在全新瀏覽器狀態直接進入攤主、主辦方與管理員後台。
- 必須返回對應角色登入頁，且不可建立該角色 Token 或使用者資料。
- 三種角色案例均已通過。

### Google 註冊、登入與綁定

測試檔：`e2e/auth-google.spec.ts`、`e2e/auth-google-bind.spec.ts`

- 攤主、主辦方各包含 Google 註冊與登入 UI Smoke，共 4 個案例。
- 使用 Google SDK Stub 送出測試 credential，Google API 使用 `page.route()` Stub，不會操作真實 Google 帳號。
- Google 綁定先使用 Real API 登入建立 Session，再 Stub `/api/auth/google-bind` 與 `/api/auth/me`，不會真的改變帳號綁定狀態。
- 6 個 Google UI Smoke 均已通過。

### 登入後修改密碼

測試檔：`e2e/auth-password.spec.ts`

- 攤主、主辦方各 1 個 Real API Smoke，先驗證錯誤目前密碼不可修改，再以正確目前密碼修改。
- 成功修改後會在 `finally` 使用同一個 JWT 將密碼還原，避免影響其他測試。
- 2 個案例已完成撰寫並可被 Playwright 載入，但目前尚未實跑：8081 未啟動，直接啟動後端時 SQL Server 拒絕目前的 `sa` 登入設定。
- 必須以可正常連線資料庫的方式重新啟動新版後端，再執行 `npx playwright test e2e/auth-password.spec.ts`。

目前共有 22 個帳號 Smoke：原有 14 個及新增 6 個 Google UI Smoke 已通過，AUTH-07 的 2 個 Real API Smoke 待後端與資料庫可用後實跑。最近一次全部既有測試的完整結果仍為 `14 passed`。

## 7. 預定 Smoke 範圍

每項帳號功能只實作一個最小成功 Smoke；只有登入等高風險功能可保留一個重要失敗 Smoke。

| 編號 | 最小 Smoke | API 方式 | 完成限制 |
| --- | --- | --- | --- |
| AUTH-01 | 填寫註冊資料並進入驗證碼頁 | UI Stub | 不代表真實註冊或寄信成功 |
| AUTH-02 | 輸入測試驗證碼並啟用帳號 | Real API | 需要 Mailpit 或 E2E 取碼機制 |
| AUTH-03 | 正確登入；必要時保留錯誤密碼 | Real API | 需要各角色專用測試帳號 |
| AUTH-04 | 寄送重設碼並進入驗證頁 | UI Stub | 完整重設需要測試信箱與可還原密碼帳號 |
| AUTH-05 | Google 註冊或登入後進入下一頁 | UI Stub | 真實整合需要 OAuth 測試替身 |
| AUTH-06 | Google 綁定成功並更新畫面 | UI Stub | 真實綁定目前不可安全解除 |
| AUTH-07 | 正確目前密碼可修改；錯誤目前密碼不可修改 | Real API | 使用可還原密碼的專用測試帳號 |
| AUTH-08 | 登出並清除 Session | Real API | 可放入 pre-push |
| AUTH-09 | 未登入直接進後台會返回登入頁 | Auth Guard | 可放入 pre-push |
| AUTH-10 | 使用一次性帳號註銷並拒絕再次登入 | Real API／Destructive | 不放入 pre-push，必須明確執行 |

## 8. Email、Google 與資料限制

### Email

正式後端已具備註冊、寄送驗證碼、Email 驗證、忘記密碼與重設密碼 API；目前只有 UI Smoke 並不是因為正式功能尚未實作，而是 E2E 測試環境還缺少以下能力：

- Playwright 無法直接讀取寄到真實信箱的六位數驗證碼。
- 真實註冊每次都會建立新帳號，尚未提供獨立測試資料庫或測試資料清理方式，直接放進 pre-push 會持續累積待驗證帳號。
- 忘記密碼流程會真的改變帳號密碼，必須使用可還原密碼的專用帳號，並在測試結束後還原。

因此目前的範圍如下：

- AUTH-01 使用 API Stub，只驗證註冊表單、request payload、成功訊息及 Email 驗證頁導向，不會建立真實帳號或寄信。
- AUTH-02 尚未完成 Real API，因為無法自動取得驗證碼。
- AUTH-04 使用 API Stub，只驗證忘記密碼 request payload、成功訊息及驗證頁導向，尚未驗證真實寄信、驗證碼及最終密碼更新。

建議使用 Mailpit 作為 E2E SMTP：後端在 E2E profile 將郵件寄到 Mailpit，Playwright 再透過 Mailpit API 取得驗證碼。這只需要 E2E 郵件環境設定，不應修改正式 API 讓驗證碼直接回傳。完成 Real API 前，AUTH-01、AUTH-04 必須維持標示為「UI Smoke」。

### Google

自動測試不可操作個人 Google 帳號、2FA 或真實 OAuth 彈窗。AUTH-05、AUTH-06 先使用 Google SDK Stub；只有測試環境具備 OAuth verifier Stub 或專用 Google 測試帳號時，才能標示真實整合完成。

### 修改密碼

AUTH-07 的功能串接與 E2E 程式已於 2026-07-15 完成：

- 前端呼叫 `POST /api/auth/resetPassword/reset`，payload 包含 `currentPassword` 與新密碼 `password`。
- 登入 JWT 由既有 interceptor 自動加入 `Authorization: Bearer ...`。
- 後端先以 BCrypt 比對目前密碼，驗證成功後才更新密碼。
- 未提供目前密碼或密碼錯誤時，後端不更新並回傳對應中文錯誤訊息。
- 使用 Email `resetToken` 的忘記密碼流程不要求 `currentPassword`，原流程不受影響。
- 後端 `UserServiceTest` 共 23 個通過；前端帳號設定元件測試共 5 個通過。

AUTH-07 的 Real API Playwright 測試已撰寫，但因後端未能以目前 SQL Server 登入設定啟動，尚未完成實跑驗證；在實跑通過前不可標示為「已完成」。測試會自動把密碼改回原值，若還原失敗則會顯示必須立即檢查測試帳號的錯誤。

### 註銷帳號

AUTH-10 測試檔為 `e2e/auth-deactivate.spec.ts`，程式已完成但尚未實跑。它會永久停用帳號，必須使用一次性、已驗證且沒有進行中資料的專用帳號，標記 `@destructive` 並手動執行 `npm run e2e:destructive`。測試會確認註銷 API 成功、Session 被清除，並驗證原帳密無法再次登入；不會由 pre-push 或 `npm run e2e:smoke` 執行。

## 9. 環境變數規劃

各角色共用 Smoke 使用：

```env
E2E_VENDOR_EMAIL=
E2E_VENDOR_PASSWORD=
E2E_ORGANIZER_EMAIL=
E2E_ORGANIZER_PASSWORD=
E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
```

真實值只寫入不提交 Git 的 `.env.e2e.local`；環境變數格式以本節為準。

破壞性帳號必須獨立命名，不得和 Smoke 共用：

```env
E2E_DESTRUCTIVE_ROLE=
E2E_DESTRUCTIVE_EMAIL=
E2E_DESTRUCTIVE_PASSWORD=
```

## 10. 建議實作順序

1. 建立 Email 驗證碼測試工具，完成 AUTH-02 Real API。
2. 以正確資料庫設定啟動新版後端，實跑 AUTH-07 Real API。
3. 設定一次性帳號並實跑 AUTH-10 Destructive。

## 11. 更新規則

新增或修改帳號測試後，負責人需更新：

- 測試檔名稱。
- 適用角色。
- Smoke／Destructive 分類。
- Real API／UI Stub 方式。
- 最新狀態及阻擋原因。
- 測試資料與 cleanup 要求。

不得因為 UI Stub 通過，就把狀態改成 Real API 已完成。
