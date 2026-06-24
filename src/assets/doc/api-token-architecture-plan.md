# Market Day 前端 API 與 Token 架構規劃書

## 1. 規劃目的

本專案是專題開發，主要情境是組員各自在自己的電腦執行前端與後端。

本規劃書依照目前 Market Day 專案內容整理，目標是建立一套統一的前端 API 與 Token 架構，讓後續串接後端時可以共用同一套規則。

本文件規劃範圍：

- API base URL 設定
- API 回傳格式
- 共用 `HttpService`
- 登入與 Token 管理
- `authInterceptor`
- `authGuard`
- 既有 SweetAlert 封裝整理
- 團隊 API 使用方式

---

## 2. 專案現況掃描

### Angular 與套件

目前專案是 Angular standalone 架構。

`package.json` 主要版本：

```txt
Angular: 20.x
RxJS: 7.8.x
SweetAlert2: 11.x
Bootstrap / Bootstrap Icons
```

### app.config.ts 現況

目前 `src/app/app.config.ts` 已有：

```ts
provideRouter(
  routes,
  withViewTransitions()
)
```

目前尚未註冊：

```ts
provideHttpClient(...)
```

因此後續 API 架構需要在 `app.config.ts` 補上 `provideHttpClient` 與 `authInterceptor`。

### routes 現況

目前路由已經有以下主要區塊：

```txt
/user/...
/vendor/...
/organizer/...
/admin/login
/vendor/dash-board/...
/organizer/dash-board/...
/admin/dash-board/...
```

登入與註冊頁面已經透過同一組 Auth 元件依 route data 切換：

```txt
src/app/modules/auth/auth/auth.ts
src/app/models/config/auth-route-data.ts
```

目前後台路由尚未套用登入保護，因此後續會在 dashboard routes 加上 `authGuard`。

### Auth 頁面現況

目前已有：

```txt
src/app/modules/auth/auth-login/auth-login.ts
src/app/modules/auth/auth-register/auth-register.ts
src/app/modules/auth/auth-forgot-password/auth-forgot-password.ts
src/app/modules/auth/auth-reset-password/auth-reset-password.ts
src/app/modules/auth/auth-verify-email/auth-verify-email.ts
```

`auth-login.ts` 目前是預留假登入流程，之後會改成呼叫 `AuthService.login()`。

### Alert 現況

目前已有 SweetAlert2 共用封裝：

```txt
src/app/modules/shared/alert.ts
```

目前 class 名稱：

```ts
export class Alert
```

且多個 auth 與 dashboard 頁面已經在使用它。

後續整理架構時，會將它改名為：

```txt
src/app/core/services/alert.service.ts
```

class 名稱調整為：

```ts
export class AlertService
```

### Environment 現況

目前專案尚未建立：

```txt
src/environments/environment.ts
```

後續 API 架構會新增這個檔案，集中管理後端 API URL。

---

## 3. 本機開發環境

### 前端

Angular 前端本機開發位置：

```txt
http://localhost:4200
```

### 後端

後端 API 本機位置：

```txt
http://localhost:8081
```

### 說明

本專題預設：

```txt
Frontend: http://localhost:4200
Backend:  http://localhost:8081
```

前端透過 `environment.apiBaseUrl` 統一設定後端 API 位置。

---

## 4. 架構規劃總覽

本專案規劃採用：

```txt
Angular standalone
+ environment
+ HttpService
+ AuthService
+ authInterceptor
+ authGuard
+ LoadingService
+ AlertService
```

核心原則：

- API URL 由 `environment.apiBaseUrl` 統一管理
- API request 由 `HttpService` 統一處理
- token 由 `AuthService` 與 `authInterceptor` 統一管理
- Bearer token 由 `authInterceptor` 自動帶入
- 後台頁面由 `authGuard` 保護
- 簡單 API 可直接在 component 透過 `HttpService` 呼叫
- 重複或複雜 API 再抽成功能 service

---

## 5. 建議新增與調整檔案

```txt
src/
  environments/
    environment.ts

  app/
    core/
      models/
        api-result.model.ts

      auth/
        auth-storage.constants.ts
        auth.service.ts
        auth.guard.ts

      http/
        http.service.ts
        auth.interceptor.ts

      services/
        loading.service.ts
        alert.service.ts
```

既有檔案調整：

```txt
src/app/app.config.ts
src/app/app.routes.ts
src/app/modules/auth/auth-login/auth-login.ts
src/app/modules/shared/alert.ts
```

---

## 6. Environment 設定

### 新增檔案

```txt
src/environments/environment.ts
```

### 內容

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/',
};
```

團隊只要統一後端跑在 `8081`，前端就可以共用同一份設定。

---

## 7. API 回傳格式

### 新增檔案

```txt
src/app/core/models/api-result.model.ts
```

後端 API 回傳欄位開頭統一使用小寫，因此前端 model 也統一使用小寫欄位：

```ts
export interface ApiResult<T = unknown> {
  statusCode: number;
  message: string;
  token?: string;
  data: T;
}
```

後續所有 API 串接範例都以 `statusCode`、`message`、`token`、`data` 為準。

---

## 8. Token 儲存規劃

### 新增檔案

```txt
src/app/core/auth/auth-storage.constants.ts
```

### 內容

```ts
export const AUTH_TOKEN_KEY = 'MarketDayToken';
export const AUTH_USER_KEY = 'MarketDayUser';
```

localStorage key 使用專案專屬名稱：

```txt
MarketDayToken
MarketDayUser
```

`MarketDayToken` 用來儲存後端回傳的 token，負責 API 驗證。

`MarketDayUser` 用來儲存登入後前端需要使用的使用者資料，例如使用者名稱、角色、Email 或目前登入身分。

後端使用同一個 token 做驗證，前端的 `MarketDayUser` 不是 token，也不參與後端驗證。

`MarketDayUser` 的主要用途：

- 顯示目前登入者資訊，例如名稱、Email、角色
- 判斷目前登入身分，例如 `vendor`、`organizer`、`admin`
- 登入後依角色導向對應 dashboard
- 控制前端畫面顯示，例如側邊欄、歡迎訊息或角色相關內容
- 頁面重新整理後，前端可以先用本機使用者資料恢復基本畫面狀態

流程如下：

```txt
後端回傳 token
-> 前端存到 localStorage['MarketDayToken']
-> 前端將登入後需要顯示或判斷的使用者資料存到 localStorage['MarketDayUser']
-> API request 自動帶 Authorization: Bearer token
```

`MarketDayUser` 範例：

```ts
{
  id: 3,
  name: '王小明',
  email: 'test@example.com',
  role: 'vendor'
}
```

---

## 9. AuthService 規劃

### 新增檔案

```txt
src/app/core/auth/auth.service.ts
```

### 負責功能

`AuthService` 負責登入狀態相關邏輯：

- 登入
- 登出
- 儲存 token
- 取得 token
- 清除 token
- 儲存使用者資料
- 取得使用者資料
- 清除使用者資料
- 判斷是否已登入

### 建議方法

```ts
login(payload: LoginRequest): Observable<ApiResult<LoginResponse>>;

logout(): void;

saveToken(token: string): void;

getToken(): string | null;

saveUser(user: MarketDayUser): void;

getUser(): MarketDayUser | null;

clearSession(): void;

isLoggedIn(): boolean;
```

### AuthLogin 串接方式

目前 `auth-login.ts` 有假登入流程，後續改為：

```ts
this.authService.login(formValue).subscribe(res => {
  if (res.statusCode === 200 && res.token) {
    this.authService.saveToken(res.token);
    this.authService.saveUser(res.data.user);
    this.router.navigate(['/vendor/dash-board']);
  }
});
```

實際登入後導向哪個 dashboard，依 route data 的 `role` 判斷：

```txt
vendor -> /vendor/dash-board
organizer -> /organizer/dash-board
admin -> /admin/dash-board
```

---

## 10. HttpService 規劃

### 新增檔案

```txt
src/app/core/http/http.service.ts
```

### 負責功能

`HttpService` 負責 API request 的共用處理：

- 組合 API URL
- GET
- POST
- DELETE
- upload
- 基本錯誤處理

### 方法

```ts
get<T>(api: string): Observable<ApiResult<T>>;

post<T>(api: string, body: unknown): Observable<ApiResult<T>>;

delete<T>(api: string): Observable<ApiResult<T>>;

upload<T>(api: string, formData: FormData): Observable<ApiResult<T>>;
```

### 使用方式

```ts
this.httpService.get('Market/GetList');
```

實際呼叫：

```txt
http://localhost:8081/Market/GetList
```

---

## 11. authInterceptor 規劃

### 新增檔案

```txt
src/app/core/http/auth.interceptor.ts
```

### 負責功能

`authInterceptor` 負責全域 API request 與 response 的 token 處理：

- 非登入 API 自動加 Bearer token
- 登入 API 不加 token
- response 有新 token 時自動更新
- token 過期時清除登入狀態
- 401 或 token 錯誤時導回登入頁

### Request 行為

非登入 API 自動加上：

```http
Authorization: Bearer <MarketDayToken>
```

### Response 行為

如果後端回傳新 token：

```ts
if (body.token) {
  authService.saveToken(body.token);
}
```

### Error 行為

遇到以下狀況時：

```txt
HTTP 401
statusCode = 302
statusCode = 600
```

執行：

1. 清除 token
2. 顯示提示訊息
3. 導回對應登入頁

---

## 12. app.config.ts 調整

目前 `app.config.ts` 已有 router 設定，後續補上 `provideHttpClient`：

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/http/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withViewTransitions()
    ),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
};
```

---

## 13. authGuard 規劃

### 新增檔案

```txt
src/app/core/auth/auth.guard.ts
```

### 負責功能

`authGuard` 保護需要登入後才能進入的 dashboard 頁面。

目前建議套用在：

```txt
/vendor/dash-board
/organizer/dash-board
/admin/dash-board
```

### routes 調整方向

```ts
{
  path: 'vendor/dash-board',
  component: DashboardLayout,
  canActivate: [authGuard],
  data: { role: 'vendor' },
  children: [...]
}
```

`organizer/dash-board` 與 `admin/dash-board` 也使用同樣方式。

---

## 14. Login 使用流程

### 流程

1. 使用者進入 `/vendor/login`、`/organizer/login` 或 `/admin/login`
2. 輸入登入資料
3. 按下登入
4. 呼叫 `AuthService.login()`
5. 後端驗證成功後回傳 token 與使用者資料
6. 前端儲存 token
7. 前端儲存登入後需要使用的使用者資料
8. 依角色導向 dashboard

### 範例

```ts
this.authService.login(formValue).subscribe(res => {
  if (res.statusCode === 200 && res.token) {
    this.authService.saveToken(res.token);
    this.authService.saveUser(res.data.user);
    this.router.navigate([this.getDashboardUrl()]);
  }
});
```

---

## 15. Logout 使用流程

### 流程

1. 使用者按下登出
2. 若後端有 logout API，先呼叫後端
3. 清除 token 與使用者資料
4. 導回登入頁

### 範例

```ts
logout(): void {
  this.authService.clearSession();
  this.router.navigate(['/vendor/login']);
}
```

專案內統一使用 `MarketDayToken` 儲存 token，使用 `MarketDayUser` 儲存登入後前端需要的使用者資料。

---

## 16. LoadingService 規劃

### 已新增檔案

```txt
src/app/core/services/loading.service.ts
src/app/modules/shared/loading-spinner/loading-spinner.ts
src/app/modules/shared/loading-spinner/loading-spinner.html
src/app/modules/shared/loading-spinner/loading-spinner.scss
```

### 負責功能

統一控制全域 loading 狀態，畫面顯示小集日風格的 loading。

Loading 畫面設計會延續小集日 logo 的風格：

- 上方使用小集日帳篷圖片，保留原本 logo 質感
- 下方使用自製 CSS 圓點，不使用 loading 圖片
- 使用四顆不同大小的圓點作為 loading
- 色彩使用奶油黃、暖橘、咖啡、深咖啡
- 不顯示文字，避免 loading 畫面過重
- 圓點會依序輕微跳動，讓使用者知道正在載入
- loading 顯示時會鎖住背景捲動，避免使用者在 loading 期間操作或滑動畫面

### LoadingService 方法

```ts
readonly isLoading: Signal<boolean>;

startLoading(): void;

stopLoading(): void;

clear(): void;
```

### 使用方式

`App` 會統一放置 loading 元件：

```html
<router-outlet></router-outlet>
<app-loading-spinner [displayStatus]="loadingService.isLoading()"></app-loading-spinner>
```

之後 API 架構完成後，會由 HttpService 在 request 開始時呼叫 `startLoading()`，在 request 結束時呼叫 `stopLoading()`。

---

## 17. AlertService 規劃

### 目前檔案

```txt
src/app/modules/shared/alert.ts
```

### 目標檔案

```txt
src/app/core/services/alert.service.ts
```

### 調整方向

目前專案已有共用 `Alert`，並已經包裝 SweetAlert2。

後續整理架構時：

- `alert.ts` 改名為 `alert.service.ts`
- `Alert` class 改名為 `AlertService`
- import 路徑統一改到 `core/services`

### 使用方式

```ts
constructor(private readonly alertService: AlertService) {}

async save(): Promise<void> {
  await this.alertService.success('儲存成功');
}
```

---

## 18. CORS 注意事項

因為前端和後端 port 不同：

```txt
Frontend: http://localhost:4200
Backend:  http://localhost:8081
```

後端需要允許：

```txt
http://localhost:4200
```

否則瀏覽器會阻擋 API request。

---

## 19. 建議開發順序

### Step 1：建立 environment

新增：

```txt
src/environments/environment.ts
```

設定：

```txt
apiBaseUrl = http://localhost:8081/
```

### Step 2：建立 API response model

新增：

```txt
src/app/core/models/api-result.model.ts
```

### Step 3：建立 HttpService

新增：

```txt
src/app/core/http/http.service.ts
```

完成：

- get
- post
- delete
- upload

### Step 4：建立 AuthService

新增：

```txt
src/app/core/auth/auth.service.ts
```

完成：

- token 儲存
- token 讀取
- token 清除
- 使用者資料儲存
- 使用者資料讀取
- 使用者資料清除
- login
- logout

### Step 5：建立 authInterceptor

新增：

```txt
src/app/core/http/auth.interceptor.ts
```

完成：

- 自動帶 Bearer token
- 自動更新 response token
- token 過期處理

### Step 6：調整 app.config.ts

加入：

```ts
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

### Step 7：建立 authGuard

新增：

```txt
src/app/core/auth/auth.guard.ts
```

套用到：

```txt
/vendor/dash-board
/organizer/dash-board
/admin/dash-board
```

### Step 8：串接 AuthLogin

將目前假登入流程改成呼叫 `AuthService.login()`。

### Step 9：整理 AlertService 命名

將既有：

```txt
src/app/modules/shared/alert.ts
```

整理為：

```txt
src/app/core/services/alert.service.ts
```

### Step 10：開始串接各功能 API

依照 API 複雜度決定寫法：

- 簡單頁面、只使用一次的 API：可以先在 component 中透過 `HttpService` 呼叫
- 同一功能有多個 API、會重複使用、或需要整理資料：再抽成獨立功能 service

---

## 20. 團隊使用方式

### Component API 呼叫方式

簡單頁面、只使用一次的 API，可以在 component 中直接透過 `HttpService` 呼叫：

```ts
this.httpService.get('Market/GetList').subscribe(res => {
  this.markets = res.data;
});
```

同一功能 API 變多、會重複使用、或需要整理資料時，再抽成獨立功能 service：

```ts
this.marketService.getMarketList().subscribe(res => {
  this.markets = res.data;
});
```

### Token 由 interceptor 處理

Component 只需要透過 `HttpService` 或功能 service 呼叫 API，不需要處理 `Authorization` header。

Token 由 `authInterceptor` 統一帶入 API request。

### API URL 由 environment 控制

呼叫 API 時只傳 API path：

```ts
this.httpService.get('Market/GetList');
```

API 位置由 `environment.apiBaseUrl` 統一控制。

---

## 21. 最小可行版本

第一版完成以下流程即可：

```txt
Login
  -> AuthService.login()
  -> 儲存 MarketDayToken
  -> 儲存 MarketDayUser
  -> 依角色進入 dashboard

Dashboard Page
  -> authGuard 檢查 token

API Request
  -> HttpService
  -> authInterceptor 自動帶 Bearer token

Token Expired
  -> 清除 session
  -> 回 Login
```

完成這些後，後續功能頁面即可穩定串接 API。

---

## 22. 最終結論

依目前專案現況，本專題建議採用：

```txt
Angular standalone 架構
+ environment apiBaseUrl
+ HttpService
+ AuthService
+ authInterceptor
+ authGuard
+ 既有 Alert 整理為 AlertService
```

整體方向：

- API URL 集中管理
- Token 集中管理
- 錯誤集中處理
- 保留現有 auth 頁面與 route data 架構
- dashboard routes 加上 authGuard
- 簡單 API 可先寫在 component，重複或複雜 API 再抽成功能 service
