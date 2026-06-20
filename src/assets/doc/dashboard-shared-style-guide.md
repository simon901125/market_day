# 後台共用樣式與元件規範

> 範例畫面：主辦方後台－活動管理

---

## 目的

為了統一後台介面風格與程式架構，後續開發後台頁面時請優先使用共用樣式與元件，避免每個頁面各自重寫搜尋列、按鈕、表格與分頁樣式。

本文件以「主辦方後台－活動管理」作為開發範例。

---

## 適用範圍

以下類型頁面請優先依照本規範開發：

* 列表頁
* 管理頁
* 搜尋頁
* 表格頁
* 後台 CRUD 頁面

---

## 共用 SCSS

後台通用控制項樣式：

```txt
src/assets/scss/_dashboard-controls.scss
```

`styles.scss` 已引入：

```scss
@use "./assets/scss/dashboard-controls";
```

目前包含：

* 後台頁首
* 頁面標題
* 搜尋列外框
* 搜尋 Input
* 後台按鈕
* 建立按鈕

---

## 共用元件

### Dropdown

```html
<app-dropdown></app-dropdown>
```

### Date Range Selector

```html
<app-date-range-selector></app-date-range-selector>
```

### Data Table

```html
<app-dashboard-data-table></app-dashboard-data-table>
```

### Pagination

```html
<app-dashboard-pagination></app-dashboard-pagination>
```

---

## 開發原則

### 頁面 SCSS 負責

* 頁面寬度
* 高度
* Grid 欄位比例
* RWD 排版

### 共用 SCSS 負責

* 控制項外觀
* 按鈕樣式
* 搜尋列樣式
* Input 樣式

### 共用元件負責

* 元件內部結構
* 元件內部樣式
* 元件互動行為

---

## 不建議做法

頁面 SCSS 不要重寫：

* Input 樣式
* Dropdown 樣式
* Date Input 樣式
* Button 樣式
* Table Action Button 樣式

若需要調整樣式：

1. 優先修改共用 SCSS
2. 優先修改共用元件
3. 避免只修改單一頁面造成樣式不一致

---

## 簡單記法

頁面管排版。

共用 SCSS 管後台控制項。

共用 Component 管自己的樣式與功能。

以主辦方後台「活動管理」頁面作為後續開發參考範例。
