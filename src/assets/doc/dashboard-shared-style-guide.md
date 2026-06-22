# Dashboard 共用樣式與元件說明

這份文件整理後台右側內容區常用的頁面標題、篩選列、表格、通知列表與分頁寫法。之後製作後台列表頁時，優先使用這裡的共用 class 與共用元件，避免每個頁面各自刻版型。

## 共用 SCSS

```txt
src/assets/scss/_shared-controls.scss
src/assets/scss/_status-colors.scss
src/styles.scss
```

`styles.scss` 已引入共用控制項樣式：

```scss
@use "./assets/scss/shared-controls";
@use "./assets/scss/status-colors";
```

## 共用 Component

- `app-dropdown`：後台下拉選單
- `app-date-range-selector`：日期區間選擇
- `app-dashboard-data-table`：後台資料表格
- `app-dashboard-pagination`：後台分頁
- `app-dashboard-notification`：後台通知列表

## 共用 class

- `.app-page-header`：頁面標題列
- `.app-page-title`：頁面主標題
- `.app-filter-bar`：搜尋/篩選列
- `.app-search-field`：搜尋欄位外層
- `.app-control-title`：欄位標題
- `.app-search-input`：搜尋 input 外層
- `.app-btn`：共用按鈕
- `.app-btn.primary`：主要按鈕
- `.app-btn.search`：搜尋按鈕

## 列表頁固定底部分頁

後台列表頁若需要「分頁永遠在畫面底部」，請使用以下三個共用 class。

- `.dashboard-list-page`：列表頁最外層，負責撐滿可視高度並使用 flex column。
- `.dashboard-list-content`：中間內容區，資料多時這裡滾動。
- `.dashboard-list-pagination`：分頁區，固定在列表頁底部。

範例：

```html
<section class="organizer-event-management dashboard-list-page page-transition">
  <header class="app-page-header">
    <h1 class="app-page-title">活動管理</h1>
    <button type="button" class="app-btn primary app-create-btn">
      <i class="bi bi-plus-lg"></i>
      建立活動
    </button>
  </header>

  <section class="app-filter-bar organizer-event-filter" aria-label="活動篩選">
    <!-- 搜尋與篩選條件 -->
  </section>

  <div class="dashboard-list-content">
    <app-dashboard-data-table
      [columns]="columns"
      [rows]="displayRows"
      emptyText="目前沒有資料"
      (actionClick)="onTableAction($event)"
    ></app-dashboard-data-table>
  </div>

  <app-dashboard-pagination
    class="dashboard-list-pagination"
    [currentPage]="currentPage"
    [pageSize]="pageSize"
    [totalItems]="totalItems"
    (pageChange)="onPageChange($event)"
  ></app-dashboard-pagination>
</section>
```

注意：

- 不要把固定底部邏輯寫死在 `app-dashboard-pagination` 元件裡，因為分頁元件也可能被放在卡片、通知區塊或其他非整頁列表的位置。
- 固定底部是「頁面版型」責任，請由頁面外層套 `.dashboard-list-page` 控制。
- 如果資料很多，請讓 `.dashboard-list-content` 滾動，不要讓整頁把分頁擠出畫面。

## 頁面專屬 SCSS 範例

```scss
.organizer-event-management {
  max-width: 1200px;
  margin: 0 auto;
  gap: 14px;
}

.organizer-event-filter {
  grid-template-columns: minmax(220px, 1.2fr) minmax(170px, 0.8fr) minmax(300px, 1.4fr) 92px;
}
```
