import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-brandserch-pagination',
  imports: [],
  templateUrl: './user-brandserch-pagination.html',
  styleUrl: './user-brandserch-pagination.scss',
})
export class UserBrandserchPagination implements OnInit {
  /** 頁碼切換事件，傳出當前頁碼給父元件 */
  @Output() pageChange = new EventEmitter<number>();

  /** 每頁顯示筆數 */
  readonly pageSize = 6;

  /** 品牌總筆數，由 ngOnInit 取得 */
  totalCount = 0;

  /** 目前頁碼 */
  currentPage = 1;

  ngOnInit(): void {
    // 取得總筆數，待 API 實作後替換為實際 HTTP 請求
    this.fetchTotalCount();
  }

  /** 取得品牌總筆數（API 尚未實作，暫用假資料） */
  private fetchTotalCount(): void {
    // TODO: 替換為實際 API 請求
    this.totalCount = 30;
  }

  /** 計算總頁數 */
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  /** 計算要顯示的頁碼陣列，不連續處以 '...' 代替 */
  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    const rangeStart = Math.max(2, current - 2);
    const rangeEnd = Math.min(total - 1, current + 2);

    if (rangeStart > 2) {
      pages.push('...');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  }

  /** 判斷該項目是否為省略符號 */
  isDots(page: number | string): boolean {
    return page === '...';
  }

  /** 切換至指定頁碼，並通知父元件 */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }

  /** 切換至上一頁 */
  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  /** 切換至下一頁 */
  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }
}
