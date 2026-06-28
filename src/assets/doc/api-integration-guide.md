# Market Day 前端 API 串接使用指南

這份文件給組員在前端串接後端 API 時參考，重點包含：

- API 檔案應該放哪裡
- `HttpService` 怎麼使用
- Model / Interface 怎麼建立
- Token 與登入狀態怎麼處理
- Loading 什麼時候會自動出現
- Alert / Confirm 彈跳視窗怎麼使用

---

## 1. 開發環境

### 前端

```text
http://localhost:4200
```

### 後端

```text
http://localhost:8081/
```

### API Base URL

檔案位置：

```text
src/environments/environment.ts
```

目前設定：

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081/',
};
```

串接 API 時只需要傳入後端路徑，不需要自己加 `http://localhost:8081/`。

```ts
this.httpService.get('api/organizer/account');
```

實際送出的網址會是：

```text
http://localhost:8081/api/organizer/account
```

---

## 2. API 回傳格式

後端 API 統一回傳 `ApiResult<T>`。

檔案位置：

```text
src/app/models/interface/shared/ApiResult.ts
```

格式：

```ts
export interface ApiResult<T = unknown> {
  statusCode: number;
  message: string;
  messageDetails: string | null;
  data: T;
}
```

使用時請注意：

- 成功與否看 `statusCode`
- 真正資料放在 `data`
- 不要直接寫 `res.token`，登入 token 會在 `res.data.token`

範例：

```ts
this.httpService
  .get<OrganizerAccount>('api/organizer/account')
  .subscribe((res) => {
    if (res.statusCode !== 200) {
      return;
    }

    this.account = res.data;
  });
```

---

## 3. Model / Interface 放置規則

Model 統一放在：

```text
src/app/models
```

目前常用分類：

```text
src/app/models/interface/shared
src/app/models/interface/vendor
src/app/models/interface/organizer
src/app/models/interface/admin
src/app/models/status
src/app/models/type
```

### 建議放法

| 類型 | 放置位置 |
|---|---|
| 共用回傳格式、登入資料 | `src/app/models/interface/shared` |
| 攤主專用資料 | `src/app/models/interface/vendor` |
| 主辦方專用資料 | `src/app/models/interface/organizer` |
| 管理員專用資料 | `src/app/models/interface/admin` |
| 狀態常數 | `src/app/models/status` |
| 型別 union / enum 類資料 | `src/app/models/type` |

### 命名範例

```text
OrganizerRegistrationRow.ts
OrganizerRegistrationDetail.ts
VendorApplicationDetail.ts
ApplicationStatus.ts
ActivityStatus.ts
```

### 建立 Model 範例

```ts
export interface OrganizerAccount {
  id: number;
  name: string;
  email: string;
  status: string;
}
```

Component 或 Service 使用時：

```ts
import { OrganizerAccount } from '../../../models/interface/organizer/OrganizerAccount';
```

---

## 4. HttpService 使用方式

所有前端 API 串接優先使用：

```text
src/app/core/http/http.service.ts
```

目前提供四種方法：

```ts
get<T>(api: string): Observable<ApiResult<T>>;

post<T>(api: string, body: unknown): Observable<ApiResult<T>>;

delete<T>(api: string): Observable<ApiResult<T>>;

upload<T>(api: string, formData: FormData): Observable<ApiResult<T>>;
```

### GET

```ts
this.httpService
  .get<OrganizerAccount>('api/organizer/account')
  .subscribe((res) => {
    this.account = res.data;
  });
```

### POST

```ts
const payload = {
  email: this.email,
  password: this.password,
};

this.httpService
  .post<LoginResponse>('api/organizer/local-login', payload)
  .subscribe((res) => {
    this.authService.saveSession('organizer', res.data.token, res.data.user);
  });
```

### DELETE

```ts
this.httpService
  .delete<null>(`api/organizer/events/${eventId}`)
  .subscribe((res) => {
    if (res.statusCode === 200) {
      this.alert.success('刪除成功');
    }
  });
```

### Upload

```ts
const formData = new FormData();
formData.append('file', file);

this.httpService
  .upload<UploadResult>('api/organizer/events/image', formData)
  .subscribe((res) => {
    this.imageUrl = res.data.url;
  });
```

---

## 5. API 要寫在 Component 還是 Service？

### 可以先寫在 Component 的情況

簡單頁面、只用一次的 API，可以先寫在 component。

適合情境：

- 單一按鈕送出
- 單一頁面查詢
- 不會重複使用
- 資料不需要整理成複雜格式

範例：

```ts
this.httpService
  .get<OrganizerAccount>('api/organizer/account')
  .subscribe((res) => {
    this.account = res.data;
  });
```

### 建議獨立成 Feature Service 的情況

同一功能有多個 API、會重複使用、資料需要整理，就放到功能 service。

適合情境：

- 同一功能有列表、詳情、新增、修改、刪除
- 多個 component 都會用到同一組 API
- API 回傳資料需要轉換成畫面用資料
- 未來會串接更多相同模組的 API

範例位置：

```text
src/app/modules/organizer/services/organizer-registration.service.ts
```

範例：

```ts
@Injectable({
  providedIn: 'root',
})
export class OrganizerRegistrationService {
  constructor(private readonly httpService: HttpService) {}

  getRegistrationList() {
    return this.httpService.get<OrganizerRegistrationRow[]>(
      'api/organizer/registrations'
    );
  }

  getRegistrationDetail(id: number) {
    return this.httpService.get<OrganizerRegistrationDetail>(
      `api/organizer/registrations/${id}`
    );
  }
}
```

---

## 6. Loading 使用規則

檔案位置：

```text
src/app/core/services/loading.service.ts
src/app/modules/shared/loading-spinner
```

### 一般 API 不需要手動加 Loading

只要 API 是透過 `HttpService` 打出去，Loading 會自動處理。

`HttpService` 內部已經包好：

```ts
private withLoading<T>(request$: Observable<T>): Observable<T> {
  return defer(() => {
    this.loadingService.startLoading();

    return request$.pipe(
      finalize(() => this.loadingService.stopLoading())
    );
  });
}
```

所以組員串 API 時只要這樣寫：

```ts
this.httpService
  .get<Activity[]>('api/activities')
  .subscribe((res) => {
    this.activities = res.data;
  });
```

Loading 會自動出現、自動關閉。

### 什麼時候才需要手動使用 LoadingService？

只有在沒有透過 `HttpService` 的情況才需要手動使用。

例如：

- 第三方 SDK
- Google Login popup
- 不是 Angular HttpClient 的非同步流程
- 多段流程要包成同一個 loading 狀態

範例：

```ts
this.loadingService.startLoading();

try {
  await this.googleAuthService.getCredential();
} finally {
  this.loadingService.stopLoading();
}
```

### 注意事項

- 不要在已經使用 `HttpService` 的 API 外面再手動 `startLoading()`，避免 loading 計數錯亂
- 如果自己手動開 loading，一定要在 `finally` 裡關閉
- 如果同時多支 API 進行，LoadingService 會用計數方式處理，最後一支 API 結束才會關閉

---

## 7. AlertService 使用方式

檔案位置：

```text
src/app/core/services/alert.service.ts
```

樣式位置：

```text
src/assets/scss/_sweet-alert.scss
```

專案彈跳視窗統一用 `AlertService`，不要在 component 直接寫 `Swal.fire()`。

### Import

```ts
import { AlertService } from '../../../core/services/alert.service';
```

路徑依照所在檔案層級調整。

### 注入

```ts
constructor(private readonly alert: AlertService) {}
```

### 成功提示

```ts
await this.alert.success(
  '儲存成功',
  '資料已成功更新。',
  '知道了'
);
```

### 錯誤提示

```ts
await this.alert.error(
  '儲存失敗',
  '請確認資料是否填寫完整。',
  '重新檢查'
);
```

### 警告提示

```ts
await this.alert.warning(
  '資料尚未完成',
  '請確認必填欄位都已填寫。',
  '知道了'
);
```

### 一般資訊提示

```ts
await this.alert.info(
  '提醒',
  '目前資料僅供測試使用。',
  '知道了'
);
```

---

## 8. Confirm 確認視窗使用方式

刪除、送出審核、登出、下架活動等需要使用者確認的操作，使用 `confirm()`。

### 基本 Confirm

```ts
const confirmed = await this.alert.confirm(
  '確認登出',
  '登出後需要重新登入才能進入後台。',
  '確認登出',
  '取消'
);

if (!confirmed) {
  return;
}

this.authService.logout('organizer').subscribe(() => {
  this.router.navigate(['/organizer/login']);
});
```

### API 前 Confirm

```ts
const confirmed = await this.alert.confirm(
  '確認送出審核',
  '送出後將交由管理員審核，確認要送出嗎？',
  '確認送出',
  '取消'
);

if (!confirmed) {
  return;
}

this.httpService
  .post<null>(`api/organizer/events/${eventId}/submit`, {})
  .subscribe(async (res) => {
    if (res.statusCode === 200) {
      await this.alert.success('送出成功');
    }
  });
```

### 複雜版 Confirm

如果內容需要表格、區塊、金額、原因等客製 HTML，使用 `confirmHtml()`。

```ts
const confirmed = await this.alert.confirmHtml({
  html: `
    <div class="refund-confirm-content">
      <h4>保證金退還確認</h4>
      <p>確認退還後，此操作無法復原。</p>
      <section class="refund-confirm-section">
        <span>保證金金額</span>
        <strong>NT$1,000</strong>
      </section>
    </div>
  `,
  confirmButtonText: '確認退還',
  cancelButtonText: '取消',
  popupClass: 'refund-confirm-swal',
});

if (!confirmed) {
  return;
}
```

客製樣式請放在：

```text
src/assets/scss/_sweet-alert.scss
```

---

## 9. API 錯誤處理建議

### Component 內處理方式

```ts
this.httpService
  .post<null>('api/organizer/events', payload)
  .subscribe({
    next: async (res) => {
      if (res.statusCode !== 200) {
        await this.alert.error('操作失敗', res.message);
        return;
      }

      await this.alert.success('操作成功');
    },
    error: async (error) => {
      await this.alert.error(
        '系統錯誤',
        error.error?.message || '請稍後再試。'
      );
    },
  });
```

### 後端英文錯誤要不要翻中文？

建議前端先針對常見錯誤做中文轉換，讓使用者看得懂。

範例：

```ts
private getRegisterApiMessage(message?: string): string {
  switch (message) {
    case 'Email already registered':
      return '此 Email 已經註冊，請改用登入或使用其他 Email。';
    case 'Validation failed: password: Password must be at least 8 characters and contain letters and numbers':
      return '密碼需至少 8 碼，並同時包含英文字母與數字。';
    default:
      return message || '註冊失敗，請確認資料後再試。';
  }
}
```

---

## 10. Token 與登入狀態

相關檔案：

```text
src/app/core/auth/auth.service.ts
src/app/core/auth/auth-storage.constants.ts
src/app/core/http/auth.interceptor.ts
```

### Token 儲存方式

目前依角色分開儲存：

```ts
MarketDayToken_vendor
MarketDayToken_organizer
MarketDayToken_admin
```

User 也依角色分開儲存：

```ts
MarketDayUser_vendor
MarketDayUser_organizer
MarketDayUser_admin
```

這樣可以避免攤主、主辦方、管理員互相覆蓋登入狀態。

### 登入後儲存

```ts
this.authService.saveSession(role, token, user);
```

### 取得 Token

```ts
const token = this.authService.getToken('organizer');
```

### 取得使用者

```ts
const user = this.authService.getUser('organizer');
```

### 判斷是否登入

```ts
if (this.authService.isLoggedIn('organizer')) {
  this.router.navigate(['/organizer/dash-board/home']);
}
```

### 登出

```ts
this.authService.logout('organizer').subscribe(() => {
  this.router.navigate(['/organizer/login']);
});
```

---

## 11. authInterceptor

檔案位置：

```text
src/app/core/http/auth.interceptor.ts
```

用途：

- 自動把 token 加到 API Request Header
- 遇到 401 時清除登入狀態
- 不需要在每個 component 手動加 `Authorization`

Header 格式：

```http
Authorization: Bearer <token>
```

只要透過 `HttpService` 呼叫 API，就會走 Angular HttpClient 與 interceptor。

---

## 12. 登入 / 註冊 / 忘記密碼 API

目前 AuthService 已集中處理：

```text
src/app/core/auth/auth.service.ts
```

### 一般註冊

```ts
this.authService.register('organizer', {
  name: this.directorName,
  email: this.email,
  password: this.password,
});
```

### Google 註冊

```ts
this.authService.googleRegister('organizer', {
  credential,
});
```

### Email 驗證

```ts
this.authService.verifyRegistrationEmail({
  email,
  code,
});
```

### 一般登入

```ts
this.authService.login('organizer', {
  email,
  password,
});
```

### Google 登入

```ts
this.authService.googleLogin('organizer', {
  credential,
});
```

### 忘記密碼

```ts
this.authService.requestPasswordReset({
  email,
});
```

```ts
this.authService.verifyPasswordResetEmail({
  email,
  code,
});
```

```ts
this.authService.resetPassword({
  token,
  password,
});
```

---

## 13. 組員串 API 的基本流程

### Step 1：確認後端 API 路徑

例如：

```text
GET /api/organizer/registrations
```

前端呼叫時寫：

```ts
this.httpService.get<OrganizerRegistrationRow[]>('api/organizer/registrations');
```

### Step 2：建立 Model

```text
src/app/models/interface/organizer/OrganizerRegistrationRow.ts
```

```ts
export interface OrganizerRegistrationRow {
  id: number;
  activityName: string;
  brandName: string;
  status: string;
}
```

### Step 3：在 Component 或 Feature Service 呼叫 API

簡單只用一次可以放 component。

```ts
this.httpService
  .get<OrganizerRegistrationRow[]>('api/organizer/registrations')
  .subscribe((res) => {
    this.rows = res.data;
  });
```

如果同功能很多 API，就建立 service。

### Step 4：處理成功與失敗

```ts
if (res.statusCode !== 200) {
  await this.alert.error('查詢失敗', res.message);
  return;
}
```

### Step 5：需要確認的操作先 Confirm

```ts
const confirmed = await this.alert.confirm(
  '確認刪除',
  '刪除後無法復原，確定要刪除嗎？',
  '確認刪除',
  '取消'
);

if (!confirmed) {
  return;
}
```

---

## 14. 串接 API 時的注意事項

- 所有 API 優先使用 `HttpService`
- 不要在 component 直接使用 `HttpClient`
- 不要自己組完整 URL，使用 `api/...` 即可
- 不要手動加 `Authorization` header，交給 `authInterceptor`
- 透過 `HttpService` 的 API 不需要手動處理 loading
- Alert / Confirm 統一使用 `AlertService`
- Model 統一放在 `src/app/models`
- 後端欄位若是小寫開頭，前端 model 也跟著用小寫開頭
- 常見英文錯誤訊息可以在前端轉成中文
- 簡單一次性 API 可以先寫在 component
- 會重複使用或資料需要整理的 API 要抽成 feature service

---

## 15. 建議範本

### 查詢列表

```ts
loadRows(): void {
  this.httpService
    .get<OrganizerRegistrationRow[]>('api/organizer/registrations')
    .subscribe({
      next: async (res) => {
        if (res.statusCode !== 200) {
          await this.alert.error('查詢失敗', res.message);
          return;
        }

        this.rows = res.data;
      },
      error: async (error) => {
        await this.alert.error(
          '查詢失敗',
          error.error?.message || '請稍後再試。'
        );
      },
    });
}
```

### 送出表單

```ts
async submit(): Promise<void> {
  const confirmed = await this.alert.confirm(
    '確認送出',
    '送出後將進入審核流程，確定要送出嗎？',
    '確認送出',
    '取消'
  );

  if (!confirmed) {
    return;
  }

  this.httpService
    .post<null>('api/organizer/events/1/submit', {})
    .subscribe({
      next: async (res) => {
        if (res.statusCode !== 200) {
          await this.alert.error('送出失敗', res.message);
          return;
        }

        await this.alert.success('送出成功');
      },
      error: async (error) => {
        await this.alert.error(
          '送出失敗',
          error.error?.message || '請稍後再試。'
        );
      },
    });
}
```

### 上傳檔案

```ts
uploadImage(file: File): void {
  const formData = new FormData();
  formData.append('file', file);

  this.httpService
    .upload<{ imageUrl: string }>('api/organizer/events/image', formData)
    .subscribe({
      next: async (res) => {
        if (res.statusCode !== 200) {
          await this.alert.error('上傳失敗', res.message);
          return;
        }

        this.imageUrl = res.data.imageUrl;
      },
      error: async (error) => {
        await this.alert.error(
          '上傳失敗',
          error.error?.message || '請稍後再試。'
        );
      },
    });
}
```

---

## 16. 總結

前端 API 串接原則：

```text
Component / Feature Service
  -> HttpService
  -> LoadingService 自動顯示 Loading
  -> authInterceptor 自動帶 Token
  -> Spring Boot API
  -> ApiResult<T>
  -> AlertService 顯示成功、失敗、確認視窗
```

組員只要照這份文件的方式寫，就可以讓 API 串接、Loading、Token、Alert / Confirm 的使用方式保持一致。
