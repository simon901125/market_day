# 後台右側內容區共用範例

這份文件整理後台右側內容區常用的頁面標題、搜尋篩選列、表格與分頁寫法。之後製作後台列表頁時，可以優先參考這份結構。

## 共用 SCSS

```txt
src/assets/scss/_shared-controls.scss
```

已在 `styles.scss` 引入：

```scss
@use "./assets/scss/shared-controls";
```

## 共用 Component

* `app-dropdown`：下拉選單
* `app-date-range-selector`：日期區間選擇
* `app-dashboard-data-table`：後台資料表格
* `app-dashboard-pagination`：後台分頁

## 右側內容區常用 Class

* `.app-page-header`：頁面標題列
* `.app-page-title`：頁面標題
* `.app-filter-bar`：搜尋 / 篩選列外框
* `.app-search-field`：搜尋欄位外層
* `.app-control-title`：欄位標題
* `.app-search-input`：搜尋輸入框
* `.app-btn`：共用按鈕
* `.app-btn.primary`：主要操作按鈕
* `.app-btn.search`：搜尋按鈕

## 使用原則

* 右側內容區的標題、搜尋列、表格、分頁，優先使用共用樣式與共用元件。
* 各頁自己的 SCSS 只處理排版，例如欄位寬度、grid 欄數、間距與 RWD。
* 輸入框、按鈕、hover、border、圓角不要在各頁重寫。
* 狀態顏色請統一放在 `src/assets/scss/_status-colors.scss`。

## 範例

以下以「主辦方後台－活動管理」右側內容區為例：

```html
<section class="organizer-event-management page-transition">
  <header class="app-page-header">
    <h1 class="app-page-title">活動管理</h1>

    <button type="button" class="app-btn primary app-create-btn">
      <i class="bi bi-plus-lg"></i>
      建立活動
    </button>
  </header>

  <section class="app-filter-bar organizer-event-filter" aria-label="活動篩選">
    <label class="app-search-field">
      <span class="app-control-title">活動名稱</span>
      <span class="app-search-input">
        <i class="bi bi-search"></i>
        <input type="search" placeholder="請輸入活動名稱" />
      </span>
    </label>

    <app-dropdown
      title="狀態"
      [options]="statusOptions"
      placeholder="全部狀態"
      (optionSelected)="selectStatus($event)"
    ></app-dropdown>

    <app-date-range-selector selectorTitle="活動日期"></app-date-range-selector>

    <button type="button" class="app-btn search">搜尋</button>
  </section>

  <app-dashboard-data-table
    [columns]="columns"
    [rows]="displayRows"
    emptyText="目前沒有活動資料"
    (actionClick)="onTableAction($event)"
  ></app-dashboard-data-table>

  <app-dashboard-pagination
    [currentPage]="currentPage"
    [pageSize]="pageSize"
    [totalItems]="totalItems"
    (pageChange)="onPageChange($event)"
  ></app-dashboard-pagination>
</section>
```

## 頁面自己的 SCSS 範例

```scss
.organizer-event-management {
  width: 100%;
}

.organizer-event-filter {
  grid-template-columns: minmax(260px, 1.7fr) 160px 260px 96px;
}
```
