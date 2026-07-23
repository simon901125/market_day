# Market Day 攤主專區與後台 E2E 測試計畫

最後更新：2026-07-22

## 1. 文件範圍

本文件規劃攤主（Vendor）「不需登入的攤主專區」與「登入後管理後台」的 E2E 測試，範圍包含：

- 攤主專區首頁、導覽列、關於我們、登入／註冊與管理後台入口。
- 未登入也可瀏覽的市集報名列表、搜尋／篩選、市集詳情與「立即報名」登入分流。
- 首次登入的品牌資料建立與功能鎖定。
- 市集報名、審核、取消、付款狀態與選位。
- 退款申請與退款狀態。
- 最終名單公開、活動參與及保證金退還結果。
- 通知中心、帳號資料與帳號註銷限制。

測試檔放在專案根目錄的 `e2e/`，與既有 `auth-*.spec.ts` 同層。目前已建立第一階段後台 UI Smoke 與後續案例骨架；新增的公開攤主專區案例尚待實作，不計入 4.1 節現有的通過數。

一般註冊、Email 六位數驗證碼、一般登入、Google 註冊／登入、忘記密碼、重設密碼、Google 綁定、修改密碼、登出及 Session 權限，沿用 [帳號 E2E 測試計畫](./auth-account-e2e-test-plan.md) 的 `AUTH-01`～`AUTH-10`，本文件只驗證攤主專區的入口、狀態顯示與導頁，不重複帳號表單案例。

跨角色 Happy Path 已由 [活動主流程 E2E 測試計畫](./event-main-flow-e2e-test-plan.md) 與 `e2e/event-main-flow.spec.ts` 負責。該腳本已實跑 FLOW-01～34，包含 Real API、藍新 Sandbox 付款、選位、排程與品牌公開。本文件主要補充可獨立重跑的 Vendor UI Smoke、未登入分流、錯誤情境與狀態限制，不重複宣稱跨角色主流程完成。

密碼雜湊儲存屬後端安全與資料持久層驗證，不應讓 Playwright 直接讀取正式資料庫。後端整合測試需確認儲存值不是明碼且可由專案採用的雜湊演算法驗證；E2E 只確認 API response、頁面、localStorage、sessionStorage、Trace 及 Report 都不洩漏密碼。現有 `AUTH-01` UI Stub 通過不代表密碼雜湊已驗證。

共用安裝、執行、標記及撰寫規範依 [E2E 測試共用指南](./e2e-ai-test-plan.md)。UI Stub 只能證明前端互動與 request 契約，不能標示為 Real API 已完成。

本 Vendor 功能測試套件**不測第三方金流整合**，以下項目不納入 `vendor-*.spec.ts`：

- 信用卡資料輸入及第三方付款頁。
- 金流交易建立、導轉網域與表單欄位。
- 付款失敗後向金流商重新建立交易。
- 金流簽章、callback、webhook 及交易查核。
- 實際退款交易及退款 callback。

攤主功能測試仍會驗證待付款頁的金額與期限、以 fixture 預先建立付款成功狀態後是否開放選位、付款逾期取消，以及退款申請的系統狀態；這些案例不代表金流串接已通過。真實藍新 Sandbox 交易只由 `e2e:main-flow` 明確執行，不放入快速 Vendor Smoke。

## 2. 攤主流程與狀態

```text
未登入進入攤主專區
├─ 首頁：了解報名流程、查看開放市集、前往登入／註冊
├─ 市集報名列表：搜尋／篩選 → 市集詳情
│  └─ 點擊立即報名 → 提示登入 → 攤主登入／註冊
├─ 管理後台 → 攤主登入頁
└─ 關於我們：平台理念與聯絡資訊

已登入攤主
├─ 導覽列顯示攤主名稱與登出
├─ 管理後台 → 攤主後台
├─ 市集詳情點擊立即報名
│  ├─ 品牌資料未完成 → 引導至「我的攤位」
│  └─ 品牌資料完成 → 報名資料填寫
└─ 首次登入且品牌資料未完成
   ├─ 鎖定其他攤主功能
   └─ 完成品牌、聯絡、社群、封面與商品資料
      └─ 可報名市集 → 待審核
         ├─ 審核未通過（顯示原因）
         ├─ 攤主取消 → 已取消
         └─ 審核通過 → 待付款
            ├─ 攤主取消 → 已取消
            ├─ 付款失敗 → 保持待付款，可重試
            ├─ 付款逾期 → 已逾期 → 自動已取消並釋放名額
            └─ 付款成功 → 待選位
               ├─ 報名截止前申請退款
               │  └─ 退款申請中 → 退款處理中 → 已退款並釋放名額
               ├─ 自主選位成功 → 報名完成
               └─ 選位截止仍未選位 → 最終名單階段自動分配 → 報名完成
                  └─ 活動結束與撤場驗收 → 保證金已退還／不予退還
```

### 2.1 公開頁面與登入分流

以下頁面不需登入，新的 browser context 不得被 Auth Guard 導走：

- `/vendor/home`：攤主專區首頁。
- `/vendor/sign-up`：市集報名列表。
- `/vendor/sign-up-detail/:id`：市集報名詳情。
- `/vendor/about`：關於我們。
- `/vendor/login` 與 `/vendor/register`：攤主登入與註冊入口。

需要登入的是「立即報名」後續填寫與 `/vendor/dash-board/**`。未登入時應導向攤主登入；已登入但尚未完成品牌資料時，應導向 `/vendor/dash-board/myStall`；登入且資料完成後，才能進入 `/vendor/sign-up-form`。

### 2.2 有效報名紀錄

同一攤主在同一活動只能持有一筆有效報名。以下 6 種狀態都必須阻擋第二次報名，且不可重複占用名額：

1. 待審核。
2. 待付款。
3. 待選位。
4. 報名完成。
5. 退款申請中。
6. 退款處理中。

已取消、審核未通過及已退款不屬於有效紀錄；若仍在報名期間且其他資格符合，可重新報名。

### 2.3 退款資格

只有同時符合以下條件才能提出退款：

- 報名狀態為「待選位」。
- 尚未完成選位。
- 尚未超過報名截止時間。

退款金額只包含後端核定的報名費，不退保證金。不得由前端自行以「付款總額減保證金」推算退款金額。

### 2.4 帳號註銷限制

帳號仍有進行中的報名、待付款或未完成活動時，後端必須拒絕註銷並保留 Session。只有完全沒有進行中活動時，才能執行既有 `AUTH-10` 的註銷流程。

## 3. 測試分層與完成狀態

| 類型 | 使用方式 | 可證明範圍 |
| --- | --- | --- |
| UI Smoke | Playwright `page.route()` Stub API | 表單、按鈕、導頁、訊息及 request payload |
| Real API Full | 專用 E2E 帳號、活動、fixture 與 cleanup | 權限、狀態轉移、名額、資料持久化及非法請求拒絕 |
| Destructive | 一次性選位、保證金或帳號資料 | 難以安全還原或具名額／帳號影響的真實操作 |

| 狀態 | 定義 |
| --- | --- |
| 待實作 | 僅完成測試計畫，測試檔尚未建立 |
| 已完成 UI Smoke | Stub 案例已實跑通過，不代表後端整合成功 |
| 已完成 Real API | Real API 與資料狀態已實跑通過 |
| 受前置條件阻擋 | 缺少 fixture、測試時鐘或後端契約 |

原則：

- `@smoke` 必須快速、可重跑且不留下資料。
- 建立或修改資料的案例標記 `@mutating`，並在 `finally` 或 teardown 還原。
- 完成選位、保證金及帳號註銷等不可安全還原的操作標記 `@destructive`，不得放入 pre-push。
- 每個測試可獨立執行，不依賴前一案例建立狀態。
- 業務 API 即使回傳 HTTP 200，也必須檢查 JSON `statusCode`。
- 只驗證畫面沒有按鈕不代表權限正確；取消、退款、選位、重複報名及註銷限制都要另外驗證後端拒絕非法 request。

## 4. 預定測試檔位置

| 測試檔 | 測試範圍 |
| --- | --- |
| `e2e/vendor-public-zone.spec.ts` | 不需登入的首頁、導覽列、關於我們、登入／註冊與管理後台分流 |
| `e2e/vendor-profile.spec.ts` | 首次登入限制、品牌、聯絡、社群、封面與商品 |
| `e2e/vendor-market-discovery.spec.ts` | 未登入市集列表、搜尋／篩選、詳情、報名按鈕分流與報名資格 |
| `e2e/vendor-application.spec.ts` | 報名表單、費用、送出、重複報名與審核結果 |
| `e2e/vendor-application-cancel.spec.ts` | 待審核／待付款取消、付款逾期與重新報名 |
| `e2e/vendor-payment.spec.ts` | 待付款頁、已付款 fixture 的狀態銜接與付款逾期 |
| `e2e/vendor-booth-selection.spec.ts` | 互動地圖、搶位衝突、完成選位與自動分配 |
| `e2e/vendor-refund.spec.ts` | 退款資格、狀態轉移、金額與名額釋放 |
| `e2e/vendor-publication-deposit.spec.ts` | 最終名單公開、攤位資訊及保證金結果 |
| `e2e/vendor-notification-account.spec.ts` | 通知中心、帳號資料及註銷限制 |
| `e2e/vendor-flow-helpers.ts` | 登入、Stub、fixture、狀態建立、cleanup 與共用 assertion |

目前 10 支 Vendor spec 與共用 helper 已建立。`e2e/vendor-public-zone.spec.ts` 已完成公開首頁、CTA、關於我們與導覽狀態；`e2e/vendor-market-discovery.spec.ts` 已擴充未登入瀏覽、搜尋／篩選、完整詳情與報名分流。尚無安全 fixture 的 Real API、排程、公開名單、保證金及 destructive 案例，繼續以 `test.skip` 標明；已確認需求與目前程式不一致的案例使用 `test.fixme`。

### 4.1 目前實作與實跑結果

最後實跑：2026-07-22

```powershell
npx playwright test "e2e/vendor-.*\.spec\.ts" --workers=3
```

結果：共 44 個案例，`24 passed`、`20 skipped`、`0 failed`，耗時約 46.8 秒。20 個 skipped 中包含 9 個明確需求／可存取性缺口 `test.fixme`，其餘 11 個為等待 Real API fixture、排程控制或一次性資料的 `test.skip`。公開攤主專區、未登入市集瀏覽、搜尋 query、OPEN／FULL 結果切換、查無結果與立即報名三種分流已納入回歸。

已完成 UI Smoke：

- VENDOR-PROFILE-01～03。
- VENDOR-PORTAL-01 的首頁內容、VENDOR-PORTAL-02～03、VENDOR-PORTAL-04 的未登入帳號狀態、VENDOR-PORTAL-05 及 VENDOR-PORTAL-06 的已登入後台入口。
- VENDOR-MARKET-01、03～04；VENDOR-MARKET-04 已驗證搜尋 query、OPEN／FULL 結果切換與查無結果。另含 VENDOR-MARKET-07 的現有詳情內容，以及 VENDOR-MARKET-08 的未登入／資料未完成／資料完成三種分流。
- VENDOR-APP-01～02（現有欄位驗證、確認頁與送出 payload）。
- VENDOR-CANCEL-03 的清單操作權限。
- VENDOR-PAY-01（只讀付款資料，不發起金流）。
- VENDOR-BOOTH-02、04、05 的地圖與衝突 UI Stub。
- VENDOR-REFUND-02 的報名清單限制。
- VENDOR-NOTIFY-01～02。
- VENDOR-ACCOUNT-02 的業務失敗 UI Stub；尚不代表所有阻擋狀態的 Real API 已通過。

目前 `test.fixme`：

- VENDOR-PROFILE-05：目前後台直接限制最多 3 筆商品，尚未支援「後台多筆、前台最多 3 筆」。
- VENDOR-APP-01：目前報名畫面與 request 都沒有攤位類型欄位。
- VENDOR-REFUND-02：目前報名完成詳情頁仍可能顯示退款入口。
- VENDOR-PORTAL-01：首頁市集查詢未限制 `status=OPEN`。
- VENDOR-PORTAL-04／06：未登入導覽列目前不顯示「攤主後台」入口，無法由此入口導向登入頁。
- VENDOR-MARKET-05：沒有報名截止日篩選與 query 契約。
- VENDOR-MARKET-06：卡片仍以活動日倒推截止日，且 search DTO 未提供／渲染各場次剩餘攤位。
- VENDOR-MARKET-07：詳情頁未渲染後端 `notice` 場地須知內容。
- VENDOR-MARKET-08：未登入或品牌未完成時，按鈕設為 `aria-disabled=true`，導致鍵盤／輔助科技無法觸發原本的引導對話框。

## 5. 測試案例總表

### 5.1 不需登入的攤主專區

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-PORTAL-01 | 未登入開啟攤主專區首頁 | `@smoke`／UI Stub（內容已通過；OPEN 篩選 `test.fixme`） | 不建立 Vendor Token 也能瀏覽，顯示平台功能、報名流程與目前 OPEN／可報名市集摘要，不將額滿活動當成可報名推薦 |
| VENDOR-PORTAL-02 | 首頁 CTA 導頁 | `@smoke`／UI Stub | 「立即加入攤主」前往 `/vendor/register`；「查看可報名市集」前往 `/vendor/sign-up` |
| VENDOR-PORTAL-03 | 關於我們 | `@smoke`／UI Stub | `/vendor/about` 不需登入，顯示平台理念及對外聯絡資訊 |
| VENDOR-PORTAL-04 | 未登入導覽列狀態 | `@smoke`／UI Stub（帳號狀態已通過；後台入口 `test.fixme`） | 顯示首頁、市集報名、管理後台、關於我們與登入／註冊，不顯示攤主名稱或登出 |
| VENDOR-PORTAL-05 | 已登入導覽列狀態 | `@smoke`／UI Stub | 顯示目前攤主名稱與登出，不再顯示登入／註冊；登出的 Real API 結果沿用 AUTH-08 |
| VENDOR-PORTAL-06 | 管理後台入口分流 | `@smoke`／Auth Guard＋UI Stub（已登入通過；未登入 `test.fixme`） | 未登入前往 `/vendor/login`；已登入前往 `/vendor/dash-board`，不得導向其他角色後台 |

### 5.2 品牌建立與首次登入限制

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-PROFILE-01 | 首次登入且必要資料未完成 | `@smoke`／UI Stub | 其他攤主功能呈鎖定狀態；點擊後提示先完成品牌資料並導回首次設定頁 |
| VENDOR-PROFILE-02 | 品牌必填欄位驗證 | `@smoke`／UI Stub | 品牌基本資料、聯絡資訊及必要欄位缺漏時不可完成設定 |
| VENDOR-PROFILE-03 | 品牌封面限制 | `@smoke`／UI Stub | 只接受 1 張符合格式與大小限制的封面；多張、錯誤格式或超限均拒絕 |
| VENDOR-PROFILE-04 | 建立完整品牌資料 | `@full @mutating`／Real API | 品牌、聯絡、社群、封面及至少一筆商品均持久化，`needsProfile=false`，可開始報名 |
| VENDOR-PROFILE-05 | 新增多筆商品與公開代表商品 | `@full @mutating`／Real API | 後台可保存多筆商品；前台品牌頁最多顯示 3 個代表商品，不多顯示第 4 筆 |
| VENDOR-PROFILE-06 | 編輯既有品牌資料 | `@full @mutating`／Real API | 更新後重新讀取一致，測試結束還原原始資料與圖片 |

### 5.3 市集瀏覽、搜尋、報名與審核

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-MARKET-01 | 瀏覽開放報名活動與詳情 | `@smoke`／UI Stub | 顯示活動／報名期間、地點、類別、費用、日期場次與剩餘名額；額滿活動不可進入報名表單 |
| VENDOR-MARKET-02 | 品牌類別資格 | `@full`／Real API fixture | 符合開放類別者可報名；不符合者不可送出並顯示原因 |
| VENDOR-MARKET-03 | 未登入瀏覽市集列表與詳情 | `@smoke`／UI Stub | 全新 context 沒有 Vendor Token 仍可開啟 `/vendor/sign-up` 與 `/vendor/sign-up-detail/:id`，瀏覽過程不強制登入 |
| VENDOR-MARKET-04 | 市集名稱、地區、活動日期與報名狀態篩選 | `@smoke`／UI Stub | 關鍵字、縣市／區域、活動起迄日與 OPEN／FULL 正確轉成 search API query；切換條件時只顯示符合項目，沒有符合活動時顯示空狀態 |
| VENDOR-MARKET-05 | 報名截止日篩選 | `@smoke`／待實作（受契約阻擋） | 可依報名截止日區間篩選，查詢欄位與後端契約一致；目前 UI 與 `EventSearch` 尚未提供此條件 |
| VENDOR-MARKET-06 | 市集卡片快速資訊 | `@smoke`／UI Stub（`test.fixme`） | 顯示活動資訊、後端 `registrationEndAt`、攤位費用、每日／各場次剩餘攤位與報名狀態，不以活動日倒推報名截止日 |
| VENDOR-MARKET-07 | 市集報名完整詳情 | `@smoke`／UI Stub（基本詳情已通過；`notice` `test.fixme`） | 顯示活動介紹、招商類別、場地須知、報名流程、可報名場次、攤位／設備／用電費用及剩餘名額 |
| VENDOR-MARKET-08 | 立即報名的登入與品牌資料分流 | `@smoke`／UI Stub（分流已通過；可存取性 `test.fixme`） | 未登入顯示提示並前往 `/vendor/login`；已登入但資料未完成前往 `/vendor/dash-board/myStall`；資料完成前往 `/vendor/sign-up-form` |
| VENDOR-APP-01 | 填寫完整報名資料並自動試算 | `@smoke`／UI Stub | 可選日期／場次、攤位類型、設備；用電與車牌驗證正確，費用隨選項更新 |
| VENDOR-APP-02 | 報名資料確認 | `@smoke`／UI Stub | 確認頁完整呈現活動、場次、攤位、設備、用電、車牌與後端核定費用 |
| VENDOR-APP-03 | 成功送出報名 | `@full @mutating`／Real API | 建立唯一報名編號，狀態為待審核，清單與詳情資料一致 |
| VENDOR-APP-04 | 六種有效狀態禁止重複報名 | `@full`／Real API fixture | 待審核、待付款、待選位、報名完成、退款申請中、退款處理中都拒絕第二筆，名額不變 |
| VENDOR-APP-05 | 無效紀錄可重新報名 | `@full @mutating`／Real API fixture | 已取消、審核未通過、已退款可在報名期間重新送出 |
| VENDOR-REVIEW-01 | 主辦方審核通過 | `@full @mutating`／Real API fixture | 狀態轉為待付款，顯示付款期限與付款入口，收到審核通知 |
| VENDOR-REVIEW-02 | 主辦方審核未通過 | `@full @mutating`／Real API fixture | 狀態為審核未通過，顯示未通過原因，不可付款或選位 |

### 5.4 取消、付款與逾期

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-CANCEL-01 | 待審核手動取消 | `@full @mutating`／Real API | 二次確認後為已取消，取消入口消失，名額立即且只釋放一次 |
| VENDOR-CANCEL-02 | 待付款手動取消 | `@full @mutating`／Real API | 二次確認後為已取消，付款入口失效，名額立即且只釋放一次 |
| VENDOR-CANCEL-03 | 不可取消狀態 | `@smoke`／UI Stub＋API contract | 待選位、報名完成及退款狀態無取消入口，直接呼叫 API 也被拒絕 |
| VENDOR-CANCEL-04 | 取消後重新報名 | `@full @mutating`／Real API | 報名期間內可建立新報名編號，名額最後只占用一筆 |
| VENDOR-PAY-01 | 待付款頁金額與期限 | `@smoke`／UI Stub | 顯示後端核定明細、總額與付款期限，不使用前端舊試算覆蓋後端金額 |
| VENDOR-PAY-02 | 已付款 fixture 的狀態銜接 | `@full`／Real API fixture | 預先建立付款成功資料後，報名顯示待選位、開放互動地圖並具有付款確認通知；不測實際付款過程 |
| VENDOR-PAY-03 | 付款逾期自動取消 | `@full`／排程 fixture | 付款先標示已逾期，再自動轉為已取消；付款入口失效、名額釋放並收到逾期通知 |

### 5.5 攤位選擇

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-BOOTH-01 | 未付款不可選位 | `@smoke`／UI Stub＋API contract | 待審核／待付款無選位入口；直接開 URL 或呼叫 API 也被拒絕 |
| VENDOR-BOOTH-02 | 地圖顯示分區、尺寸及占用狀態 | `@smoke`／UI Stub | 清楚區分可用、已占用及自己的攤位，資訊與 API 一致 |
| VENDOR-BOOTH-03 | 完成一日或多日選位 | `@destructive`／Real API fixture | 各報名日期都取得攤位後狀態轉為報名完成，收到攤位通知 |
| VENDOR-BOOTH-04 | 已占用攤位不可選 | `@smoke`／UI Stub | 已占用攤位不可點選，只能選 available 攤位 |
| VENDOR-BOOTH-05 | 同時搶位衝突 | `@full @mutating`／Real API 雙 context | 後送出者收到衝突提示並重新選擇，不會建立重複 assignment |
| VENDOR-BOOTH-06 | 完成選位後不可修改 | `@full`／Real API fixture | 僅能查看已選攤位，UI 無重送入口，API 也拒絕更換 |
| VENDOR-BOOTH-07 | 選位截止後自動分配 | `@full`／排程 fixture | 最終名單階段分配剩餘攤位，狀態轉為報名完成，無重複攤位並收到通知 |

### 5.6 退款

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-REFUND-01 | 待選位且截止前申請退款 | `@full @mutating`／Real API fixture | 原因必填、二次確認後轉為退款申請中，選位入口關閉，名額尚未釋放 |
| VENDOR-REFUND-02 | 完成選位後拒絕退款 | `@smoke`／UI Stub＋API contract | 報名完成無退款入口，直接呼叫 API 也被拒絕 |
| VENDOR-REFUND-03 | 報名截止後拒絕退款 | `@full`／時間 fixture | 即使已付款未選位仍不可申請，狀態及款項不變 |
| VENDOR-REFUND-04 | 主辦方審核退款 | `@full @mutating`／Real API fixture | 退款申請中轉為退款處理中，名額仍未釋放 |
| VENDOR-REFUND-05 | 退款完成狀態 | `@full @mutating`／Real API fixture | 由 fixture 或主辦方測試工具標記完成後，退款處理中轉為已退款，名額只釋放一次；不測實際退款交易 |
| VENDOR-REFUND-06 | 退款明細僅列報名費 | `@full`／Real API fixture | 攤主詳情顯示後端核定報名費且不包含保證金；不驗證金流交易 |

### 5.7 公開資訊、保證金、通知與帳號

| 編號 | 測試案例 | 分類／方式 | 預期結果 |
| --- | --- | --- | --- |
| VENDOR-PUBLIC-01 | 最終名單前不公開 | `@full`／Real API fixture | 一般使用者查不到尚未確認的品牌與攤位對應 |
| VENDOR-PUBLIC-02 | 最終名單後公開 | `@full`／Real API fixture | 前台活動頁可查看品牌與攤位，公開資料與攤主資料一致，代表商品最多 3 筆 |
| VENDOR-DEPOSIT-01 | 撤場驗收通過並退還保證金 | `@destructive`／Real API fixture | 主辦方操作後，攤主詳情顯示保證金已退還及時間 |
| VENDOR-DEPOSIT-02 | 未參與、提前退場或違規不退還 | 人工驗收＋API contract | 保持未退還並保存原因，不誤顯示為已退還 |
| VENDOR-NOTIFY-01 | 通知中心載入及分類 | `@smoke`／UI Stub | 可看到審核、付款提醒／確認、攤位分配及活動異動通知，分類與未讀數正確 |
| VENDOR-NOTIFY-02 | 通知標示已讀 | `@smoke`／UI Stub | 開啟通知後送出已讀 request，單筆與未讀總數同步更新 |
| VENDOR-NOTIFY-03 | 狀態事件產生通知 | `@full @mutating`／Real API fixture | 審核、付款、攤位及活動異動各只建立正確通知，不重複發送 |
| VENDOR-NOTIFY-04 | 登入中即時收到新通知 | `@full`／Real API＋通知通道 Stub | 不需重新登入即可依 WebSocket、SSE 或輪詢契約看到新通知，未讀數同步增加 |
| VENDOR-ACCOUNT-01 | 修改攤主基本資料 | `@full @mutating`／Real API | 儲存後重新讀取一致，測試結束還原；密碼及 Google 綁定沿用 AUTH-06／07 |
| VENDOR-ACCOUNT-02 | 有進行中流程時禁止註銷 | `@full`／Real API fixture | 進行中的報名、待付款或未完成活動都被拒絕，帳號及 Session 保持有效 |
| VENDOR-ACCOUNT-03 | 無進行中流程時允許註銷 | `@destructive`／Real API | 使用一次性帳號完成 AUTH-10，Session 清除且原帳密不可再登入 |

## 6. 關鍵案例執行腳本

### VENDOR-PORTAL-01～06 公開攤主專區

1. 使用全新 browser context，確認 localStorage 沒有 Vendor Token 或使用者資料。
2. 開啟 `/vendor/home`，驗證報名流程說明、平台功能、OPEN／可報名市集摘要及兩個 CTA。
3. 驗證「立即加入攤主」前往註冊頁，「查看可報名市集」前往市集列表。
4. 驗證導覽列顯示登入與註冊，不顯示攤主名稱或登出。
5. 點擊管理後台，驗證 Auth Guard 導向 `/vendor/login`。
6. 開啟 `/vendor/about`，驗證平台理念與聯絡資訊。
7. 以 Stub Session 重開首頁，驗證導覽列改為攤主名稱與登出，管理後台入口前往 `/vendor/dash-board`。

本組 Smoke 不需要真實帳密。登出 API 與 Session 實際清除繼續由 AUTH-08 驗證，這裡只測攤主公開導覽的狀態差異。

### VENDOR-MARKET-03～08 未登入市集瀏覽與報名分流

1. 在無 Vendor Session 的 context Stub 地址與市集 API，開啟 `/vendor/sign-up`。
2. 依市集名稱、縣市／區域、活動起迄日與報名狀態搜尋，監聽 search request 並核對 query。
3. 切換 OPEN／FULL 狀態，核對符合條件的卡片出現且上一個不符合條件的結果被移除；以不存在的關鍵字搜尋時顯示「查無符合條件的活動」。
4. 核對卡片的活動資訊、`registrationEndAt`、費用、各場次剩餘名額及 OPEN／FULL 狀態。
5. 開啟詳情，逐項核對活動介紹、招商、場地須知、報名流程、場次、費用及剩餘名額。
6. 未登入點擊「立即報名」，確認先顯示登入提示，確認後前往 `/vendor/login`。
7. 以 `needsProfile=true` 的 Stub Session 重跑，點擊後前往 `/vendor/dash-board/myStall`。
8. 以 `needsProfile=false` 的 Stub Session 重跑，點擊後前往 `/vendor/sign-up-form`。

報名截止日篩選要等 UI 與 API query 契約補齊後再啟用；在此之前 VENDOR-MARKET-05 維持受阻擋，不可改用活動日期假裝通過。

### VENDOR-PROFILE-04 完成首次品牌建立

前置條件：攤主已登入，`needsProfile=true`，尚無品牌資料。

1. 直接嘗試開啟活動報名、我的報名、付款或選位功能。
2. 驗證功能鎖定、顯示完成資料提示，並導回首次登入設定頁。
3. 填寫品牌基本資料、聯絡資訊與社群媒體。
4. 上傳 1 張品牌封面，建立至少 1 筆商品資料。
5. 監聽圖片上傳與品牌儲存 API，驗證 HTTP 及 JSON `statusCode`。
6. 重新整理後確認資料與圖片由 API 正確還原。
7. 驗證 dashboard init 回傳 `needsProfile=false`，原本鎖定的功能已開放。
8. 進入指定活動的報名表單，確認首次登入限制已解除。

Cleanup：使用可重設帳號；保存原始 profile 快照並在 `finally` 還原，或透過只在 E2E profile 啟用的 fixture 清除品牌資料。

### VENDOR-APP-03 成功報名

前置條件：品牌資料完整、類別符合、活動在報名期間且有名額。

1. 從活動詳情進入報名表單。
2. 選擇日期／場次、攤位類型與租借設備，填寫用電需求、車牌及備註。
3. 驗證每次選項變更後的試算明細與總額。
4. 進入報名資料確認頁，逐項比對輸入內容。
5. 監聽 `POST /api/vendor/applications` 後送出。
6. 驗證 payload 至少包含活動、日期／場次、攤位類型、設備、用電、車牌及備註。
7. 驗證後端產生唯一 `applicationId`／`applicationNo`，狀態為待審核。
8. 從報名清單及詳情確認資料、狀態與費用一致。

Cleanup：在待審核時取消測試報名，並確認名額回到送出前數值。

### VENDOR-APP-04 重複報名防護

對 6 種有效狀態逐一以 fixture 建立既有報名：

1. 記錄既有報名 ID 與活動剩餘名額。
2. 由相同攤主再次送出同一活動報名。
3. 驗證後端回傳明確的重複報名錯誤。
4. 驗證沒有第二筆報名、既有紀錄未改寫、名額未再次扣除。

此案例必須同時包含「退款申請中」與「退款處理中」，不可只測其中一種。

### VENDOR-PAY-01～03 付款頁與狀態銜接

1. 以待付款 fixture 進入付款頁，核對後端金額及期限。
2. 不操作付款按鈕、不輸入信用卡，也不導向第三方付款頁。
3. 由 fixture 直接建立付款完成資料，再重新進入報名詳情。
4. 驗證報名為待選位、付款確認資訊與通知存在，且選位入口開放。
5. 另以逾期 fixture 驗證付款紀錄先標示已逾期，再由排程把報名轉為已取消並釋放名額。

上述案例只驗證攤主端付款前後狀態，不驗證交易建立、失敗重試、簽章、callback 或 webhook。

### VENDOR-BOOTH-05 搶位衝突

1. 建立兩位待選位攤主，使用兩個 browser context 開啟同一活動、日期及攤位。
2. 兩邊皆選擇 A01，第一位先確認成功。
3. 第二位送出時，後端必須拒絕並顯示攤位已被選擇。
4. 重新載入地圖後 A01 顯示已占用，引導第二位改選 B01。
5. 從 API 驗證相同日期與攤位不存在兩筆有效 assignment。

### VENDOR-REFUND-01／04／05／06 退款生命週期

1. 建立已付款、待選位且未過報名截止的報名，記錄報名費與保證金。
2. 空白原因不可送出；填寫原因並二次確認後呼叫退款申請 API。
3. 驗證狀態為退款申請中，取消與選位入口關閉，名額未釋放。
4. 主辦方審核通過後，狀態為退款處理中，名額仍未釋放。
5. 由主辦方測試工具或 fixture 標記退款完成後，狀態為已退款，名額釋放一次。
6. 驗證攤主詳情顯示的退款明細只包含後端核定報名費，不含保證金。
7. 另外直接呼叫 API，驗證報名完成或超過截止時間的退款請求被拒絕。

本案例不呼叫第三方退款 API，也不驗證實際款項是否入帳。

### VENDOR-ACCOUNT-02 註銷限制

以資料列分別建立待審核、待付款、待選位、報名完成且活動未結束、退款申請中及退款處理中的帳號狀態：

1. 登入攤主帳號設定並申請註銷。
2. 確認警告視窗後送出註銷 API。
3. 驗證後端拒絕並顯示進行中流程原因。
4. 驗證 Token、使用者資料與帳號皆未清除，仍可正常使用後台。
5. 以已取消、審核未通過、已退款且沒有未完成活動的資料確認不再被業務限制；真正註銷只由一次性帳號的 `AUTH-10` 執行。

## 7. 測試資料與 fixture

| fixture | 用途 | 重設要求 |
| --- | --- | --- |
| `vendor-public-anonymous` | 公開攤主專區與未登入報名分流 | 不設 Token；市集、詳情與地址 API 使用唯讀 Stub |
| `vendor-public-logged-in` | 導覽列已登入狀態與報名分流 | 使用無簽章測試 JWT 與 Stub User，不呼叫真實登入 API |
| `vendor-profile-empty` | 首次品牌建立與功能鎖定 | 每次還原為無完整 profile |
| `vendor-profile-ready` | 活動瀏覽及一般報名 | 品牌、類別與至少 4 筆商品固定，不與 auth Smoke 共用 |
| `vendor-duplicate-status` | 六種有效狀態的重複報名 | 每個狀態獨立建立，執行後清除報名及名額占用 |
| `vendor-cancel` | 手動取消與重新報名 | 清除該活動測試報名並還原名額 |
| `vendor-payment` | 付款前後狀態與逾期 | 直接建立待付款／已付款資料，不發起金流交易 |
| `vendor-booth-a`／`vendor-booth-b` | 搶位競態 | 清除選位、鎖定及 assignment |
| `vendor-refund` | 退款申請與系統狀態 | 以 fixture 推進狀態，不發起實際退款 |
| `vendor-deactivate-blocked` | 註銷限制 | 保留帳號，只建立／清除阻擋中的活動資料 |
| `event-open` | 開放報名 Happy Path | 固定類別、場次、攤位類型、費用及足夠名額 |
| `event-deadline` | 付款、選位及退款期限 | 可控制測試時鐘或直接建立指定期限 |
| `event-finalized` | 自動分配及前台公開 | 可觸發最終名單，具可辨識品牌與攤位 |

建議建立只在 E2E profile 啟用的 seed／cleanup 工具，用來建立指定狀態、觸發付款逾期、選位截止及最終名單。若不提供測試 HTTP endpoint，可改用資料庫 seed CLI，但正式環境不得開放。

所有寫入案例需記錄 `vendorId`、`eventId`、`applicationId`、`applicationNo`、原始名額及建立的 payment／refund／selection ID。Cleanup 失敗時測試必須失敗並輸出識別值，方便人工修復。

## 8. 環境變數規劃

公開攤主專區的 UI Smoke 使用 Stub，不需要任何帳密或金鑰。Real API 或會改變資料的 Vendor Full 才沿用帳號測試的專用攤主帳密，並另增加不提交 Git 的流程資料：

```env
E2E_VENDOR_EMAIL=
E2E_VENDOR_PASSWORD=
E2E_VENDOR_PROFILE_EMPTY_EMAIL=
E2E_VENDOR_PROFILE_EMPTY_PASSWORD=
E2E_VENDOR_CONCURRENT_EMAIL=
E2E_VENDOR_CONCURRENT_PASSWORD=
E2E_VENDOR_EVENT_ID=
E2E_VENDOR_EVENT_TITLE=
```

不得在測試計畫、測試檔、Trace 或 HTML Report 寫入真實 Email、密碼、Token 或金流密鑰。值只能寫在不提交 Git 的 `.env.e2e.local`。若密碼曾出現於 Git 追蹤的文件或 Report，必須立即更換。

真實不可逆流程必須使用一次性資料，不得與 Smoke 共用：

```env
E2E_DESTRUCTIVE_VENDOR_EMAIL=
E2E_DESTRUCTIVE_VENDOR_PASSWORD=
E2E_DESTRUCTIVE_APPLICATION_NO=
```

## 9. 實作前需確認的需求／程式契約

以下差異需先確認或由測試揭露，不可用錯誤期待值讓測試勉強通過：

1. 報名表單必須有「攤位類型」欄位及對應 request 欄位；若目前前端或 API 尚未提供，VENDOR-APP-01／03 標示受阻擋。
2. 商品圖片必須有正式上傳 API；不可把瀏覽器本機 `blob:` URL 儲存到品牌 payload。
3. 報名詳情與報名清單都只能在待選位且截止前顯示退款入口；報名完成後若仍出現退款按鈕，應由 VENDOR-REFUND-02 揭露。
4. 退款金額必須由後端回傳核定報名費；前端不得自行用總額減保證金推算。
5. 付款逾期需要可觀察「已逾期」紀錄、通知及後續「已取消」狀態，不可只驗證最終取消畫面。
6. 付款逾期、自動分配與最終名單需要排程控制或測試時鐘，否則相關案例維持受阻擋。
7. 註銷限制必須由後端執行；前端提示不能取代 API 的狀態與活動完整性檢查。
8. 「即時通知」需先確認採用 WebSocket、SSE 或輪詢；若目前只有頁面載入時查詢，VENDOR-NOTIFY-04 維持受阻擋。
9. 密碼雜湊由後端整合測試負責；Playwright 不應取得密碼資料，只檢查任何前端可見內容皆未洩漏明碼。
10. 現場參與、提前退場、場地設備及撤場規範屬人工事實。Playwright 只驗證主辦方記錄結果後，攤主端顯示的保證金狀態。
11. 目前市集搜尋只支援關鍵字、縣市／區域、報名狀態及活動起迄日，尚無「報名截止日」輸入與 `EventSearch` query 欄位；VENDOR-MARKET-05 維持受阻擋。
12. 目前市集卡片以活動開始日往前 14 天推算截止日，沒有直接使用 API 的 `registrationEndAt`。VENDOR-MARKET-06 必須以後端報名截止時間為唯一來源，不可用前端倒推值讓測試通過。
13. `/vendor/home`、`/vendor/sign-up`、`/vendor/sign-up-detail/:id` 與 `/vendor/about` 應保持公開；只有立即報名後續與 `/vendor/dash-board/**` 能觸發登入／資料完整性分流。
14. 活動主流程的 FLOW-10～11 與 FLOW-32～34 驗證的是一般使用者 `/user/activity-list` 公開前台，不能取代本文件的 `/vendor/**` 公開攤主專區測試。
15. 目前 `/vendor/home` 的近期市集查詢只傳 `eventStartAt`，沒有傳 `status=OPEN`；若首頁要只推薦可報名市集，前端或後端契約必須補上開放狀態限制。
16. 未登入時 `vendor-header` 目前完全隱藏「攤主後台」鏈結；若需符合「未登入點擊後導向登入」，鏈結必須保留並指向 `/vendor/login`。
17. 目前詳情頁未顯示 API `notice` 場地須知，市集 search DTO 也沒有各場次 `dailyAvailability`，因此列表卡片無法渲染各場次剩餘攤位。
18. 未登入或 `needsProfile=true` 時，「立即報名」有 click handler 要顯示引導對話框，卻同時設為 `aria-disabled=true`。這會讓 Playwright、鍵盤與輔助科技視為不可操作；測試暫以 `dispatchEvent('click')` 驗證現有分流 handler，另以 `test.fixme` 保留可存取性要求。

## 10. 建議實作順序

### 第一階段：可安全執行的 UI Smoke

1. 已建立 `e2e/vendor-public-zone.spec.ts`，VENDOR-PORTAL-01～06 的現有功能已完成 UI Smoke；OPEN 篩選與未登入後台入口維持 `test.fixme`。
2. 已擴充 `e2e/vendor-market-discovery.spec.ts`，VENDOR-MARKET-03～04、07～08 的現有功能已完成 UI Smoke；VENDOR-MARKET-04 已涵蓋搜尋 query、OPEN／FULL 結果切換及查無結果，場地須知與報名按鈕可存取性維持 `test.fixme`。
3. 補齊報名截止日篩選、`registrationEndAt` 與各場次剩餘攤位契約後，完成 VENDOR-MARKET-05～06。
4. 維持已通過的 VENDOR-PROFILE-01～03 與 VENDOR-MARKET-01。
5. 維持 VENDOR-APP-01～02、VENDOR-CANCEL-03 與 VENDOR-PAY-01。
6. 完成 VENDOR-BOOTH-01 的 API contract，並維持已通過的 VENDOR-BOOTH-02、04、05。
7. 完成 VENDOR-REFUND-02 的詳情頁與直接 API 拒絕契約。
8. 維持 VENDOR-NOTIFY-01～02。

門檻：全部可重跑且不留下資料，才加入 `npm run e2e:smoke` 與 pre-push。

### 第二階段：Real API Full

1. 建立狀態 seed、排程控制及 cleanup 工具。
2. 完成品牌、商品上傳及前台最多 3 筆代表商品。
3. 完成報名、六狀態重複檢查、審核及取消。
4. 使用 fixture 完成付款成功、付款逾期及退款狀態案例，不串接第三方金流。
5. 完成雙攤主搶位、自動分配、公開名單、通知（含即時更新）及註銷限制。

門檻：每支測試可獨立執行，成功或失敗都能 cleanup，才能納入 `npm run e2e:full`。

### 第三階段：Destructive／發布前驗收

1. VENDOR-BOOTH-03。
2. VENDOR-DEPOSIT-01。
3. VENDOR-ACCOUNT-03／AUTH-10。
4. 保證金現場人工驗收清單。

門檻：使用一次性資料並由負責人明確執行，不得進入 pre-push。

## 11. 更新規則

新增或修改攤主 E2E 後，負責人需同步更新：

- 測試檔與測試名稱。
- 案例狀態：待實作、受阻擋、UI Smoke 已完成、Real API 已完成。
- 初始狀態建立方式及 cleanup 結果。
- UI Stub、Real API 或 fixture 的驗證範圍。
- 最近一次實跑日期、通過數及失敗原因。
- 需求、前端與後端的狀態名稱或欄位差異。

不得因 UI Stub 通過就標示 Real API 已完成，也不得只靠 UI 隱藏按鈕宣稱後端權限與狀態規則已通過。
