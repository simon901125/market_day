# SweetAlert2 共用 Alert 使用說明
本專案已將 SweetAlert2 包成共用的 `Alert` service。

## 目錄

1. [使用前準備](#1-使用前準備)
2. [Alert 有哪幾種？](#2-alert-有哪幾種)
3. [基本寫法](#3-基本寫法)
4. [參數說明](#4-參數說明)
5. [需要換行怎麼寫？](#5-需要換行怎麼寫)
6. [Confirm 確認視窗](#6-confirm-確認視窗)
7. [什麼時候需要 async / await？](#7-什麼時候需要-async--await)
8. [常見使用情境](#8-常見使用情境)
9. [注意事項](#9-注意事項)
10. [快速判斷](#10-快速判斷)

---
之後在元件中 **不要直接寫 `Swal.fire()`**，請統一使用：

```ts
this.alert.success();
this.alert.error();
this.alert.warning();
this.alert.info();
this.alert.confirm();
```

這樣可以讓所有彈跳視窗的樣式、按鈕文字、icon 保持一致。

---

## 1. 使用前準備

在要使用 Alert 的元件中匯入：

```ts
import { Alert } from '../../shared/alert';
```

> 匯入路徑請依照目前檔案位置調整。

在 `constructor` 注入：

```ts
constructor(private alert: Alert) {}
```

---

## 2. Alert 有哪幾種？

| 方法 | 用途 | 範例 |
|---|---|---|
| `success()` | 成功提示 | 儲存成功、密碼重設成功 |
| `error()` | 錯誤提示 | 登入失敗、格式錯誤 |
| `warning()` | 警告提示 | 欄位未填、資料尚未完成 |
| `info()` | 一般提示 | 系統提醒、補充說明 |
| `confirm()` | 確認視窗 | 刪除前確認、送出前確認 |

---

## 3. 基本寫法

### 成功提示

```ts
this.alert.success(
  '密碼重設成功',
  '你的密碼已更新完成，<br>現在可以返回登入並使用新密碼登入。',
  '前往登入'
);
```

### 錯誤提示

```ts
this.alert.error(
  '密碼格式不正確',
  '請確認密碼長度、格式與確認密碼是否一致。'
);
```

### 警告提示

```ts
this.alert.warning(
  '資料尚未填寫完成',
  '請確認必填欄位是否都已填寫。'
);
```

### 一般提示

```ts
this.alert.info(
  '系統提醒',
  '資料已儲存為草稿。'
);
```

---

## 4. 參數說明

Alert 的基本格式：

```ts
this.alert.success(標題, 內容, 按鈕文字);
```

例如：

```ts
this.alert.success(
  '儲存成功',
  '資料已成功儲存。',
  '確認'
);
```

### 參數說明

| 參數 | 是否必填 | 說明 |
|---|---|---|
| 第一個參數 | 必填 | 彈窗標題 |
| 第二個參數 | 可省略 | 彈窗內容 |
| 第三個參數 | 可省略 | 確認按鈕文字，預設是「確認」 |

所以也可以只寫：

```ts
this.alert.success('儲存成功');
```

---

## 5. 需要換行怎麼寫？

內容文字需要換行時，請使用 `<br>`。

```ts
this.alert.info(
  '提醒',
  '第一行文字<br>第二行文字'
);
```

---

## 6. Confirm 確認視窗

如果要讓使用者選擇「確認 / 取消」，請使用 `confirm()`。

```ts
async deleteItem(): Promise<void> {
  const confirmed = await this.alert.confirm(
    '確定要刪除嗎？',
    '刪除後將無法復原。'
  );

  if (!confirmed) {
    return;
  }

  // 使用者按下確認後才會執行
  console.log('執行刪除');
}
```

---

## 7. 什麼時候需要 async / await？

### 不需要 async / await

只是單純顯示提示，不需要等使用者按確認：

```ts
this.alert.success('儲存成功');
```

---

### 需要 async / await

如果要等使用者按下確認後，才繼續做下一件事，就需要 `async / await`。

例如：按下「前往登入」後才跳頁。

```ts
async resetPassword(): Promise<void> {
  await this.alert.success(
    '密碼重設成功',
    '你的密碼已更新完成，<br>現在可以返回登入並使用新密碼登入。',
    '前往登入'
  );

  this.router.navigate(['/vendor/login']);
}
```

例如：按下確認後才刪除。

```ts
async deleteItem(): Promise<void> {
  const confirmed = await this.alert.confirm('確定要刪除嗎？');

  if (!confirmed) {
    return;
  }

  this.deleteData();
}
```

---

## 8. 常見使用情境

### 表單驗證失敗

```ts
if (!this.email) {
  this.alert.warning('請輸入 Email');
  return;
}
```

### 密碼格式錯誤

```ts
if (!this.isPasswordFormatValid) {
  this.alert.error(
    '密碼格式不正確',
    '密碼需至少 8 個字元，並包含英文字母與數字。'
  );
  return;
}
```

### 儲存成功後跳頁

```ts
async save(): Promise<void> {
  await this.alert.success('儲存成功');

  this.router.navigate(['/user/home']);
}
```

### 刪除前確認

```ts
async deleteItem(): Promise<void> {
  const confirmed = await this.alert.confirm(
    '確定要刪除嗎？',
    '刪除後將無法復原。'
  );

  if (!confirmed) {
    return;
  }

  this.deleteData();
}
```

---

## 9. 注意事項

### 不要直接寫 Swal.fire

不建議：

```ts
Swal.fire({
  title: '儲存成功'
});
```

建議：

```ts
this.alert.success('儲存成功');
```

---

### 不要把 return 寫在 then 裡面

不建議：

```ts
this.alert.confirm('確定要刪除嗎？').then((confirmed) => {
  if (!confirmed) {
    return;
  }
});
```

建議：

```ts
const confirmed = await this.alert.confirm('確定要刪除嗎？');

if (!confirmed) {
  return;
}
```

---

## 10. 快速判斷

| 情境 | 寫法 |
|---|---|
| 只要跳提示 | `this.alert.success()` |
| 提示後要跳頁 | `await this.alert.success()` |
| 要確認 / 取消 | `await this.alert.confirm()` |
| 有 `return` 判斷 | 建議使用 `async / await` |
| 需要換行 | 內容使用 `<br>` |