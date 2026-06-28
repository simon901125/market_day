import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { OperationType } from '../../../../models/type/OperationType';
import { AdminLogItem } from '../../../../models/interface/admin/AdminLogItem';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

@Component({
  selector: 'app-admin-dashboard-logs',
  imports: [
    Dropdown,
    DateRangeSelector,
    DashboardPagination,
  ],
  templateUrl: './admin-dashboard-logs.html',
  styleUrl: './admin-dashboard-logs.scss',
})
export class AdminDashboardLogs implements AfterViewInit {
  constructor(private router: Router) {}

  @ViewChild(DateRangeSelector) timeSelectorRef!: DateRangeSelector;
  @ViewChild('oprationDropdown') oprationDropdownRef!: Dropdown;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('resultSection') resultSectionRef!: ElementRef<HTMLDivElement>;


  /** 每列高度，需與 SCSS `.activity-table tbody tr` 的高度一致 */
  private readonly rowHeight = 56;
  /** 表頭高度，需與 SCSS `.activity-table thead tr` 的高度一致 */
  private readonly headerHeight = 48;

  /** 操作類型下拉選單*/
  oprationOptions: string[] = [
    "全部",
    OperationType.activityReview,
    OperationType.requestRevision,
    OperationType.accountRestored,
    OperationType.accountDisabled,
    OperationType.systemSetting,
  ];

  /** 操作類型 -> 標籤顏色 class 對應 */
  private readonly oprationColorMap: Record<string, string> = {
    [OperationType.activityReview]: 'admin-blue',
    [OperationType.requestRevision]: 'admin-orange',
    [OperationType.accountRestored]: 'admin-green',
    [OperationType.accountDisabled]: 'admin-red',
    [OperationType.systemSetting]: 'admin-purple',
  };

  /** 假資料：模擬後端回傳的活動列表，之後可替換成真正的 API 呼叫結果 */
  private readonly mockLogs: AdminLogItem[] = [
    { id: 1, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 2, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountRestored, target: '市集', details: '操作內容'},
    { id: 3, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 4, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.requestRevision, target: '市集', details: '操作內容'},
    { id: 5, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '市集', details: '操作內容'},
    { id: 6, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 7, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.requestRevision, target: '市集', details: '操作內容'},
    { id: 8, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.systemSetting, target: '市集', details: '操作內容'},
    { id: 9, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountRestored, target: '市集', details: '操作內容'},
    { id: 10, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 11, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 12, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.requestRevision, target: '市集', details: '操作內容'},
    { id: 13, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 14, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.systemSetting, target: '市集', details: '操作內容'},
    { id: 15, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 16, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.requestRevision, target: '市集', details: '操作內容'},
    { id: 17, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.activityReview, target: '市集', details: '操作內容'},
    { id: 18, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '市集', details: '操作內容'},
    { id: 19, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '市集', details: '操作內容'},
    { id: 20, createdAt: '2026-01-01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '市集', details: '操作內容'},
    
  ];

  /** 目前篩選條件：操作類型 */
  private selectedOpration = '';
  /** 目前輸入的搜尋關鍵字 */
  searchKeyword = '';

  /** 目前頁面顯示的活動列表（已套用篩選＋分頁） */
  logs: AdminLogItem[] = [];

  /** 目前頁碼 */
  currentPage = 1;
  /** 每頁筆數，依畫面剩餘高度動態計算（見 Task 8），初始為合理預設值 */
  pageSize = 8;
  /** 篩選後的總筆數 */
  totalItems = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculatePageSize();
      this.fetchLogs();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const previousPageSize = this.pageSize;
    this.recalculatePageSize();

    if (this.pageSize !== previousPageSize) {
      this.currentPage = 1;
      this.fetchLogs();
    }
  }

  onOprationSelected(value: string): void {
    this.selectedOpration = value === "全部" ? '' : value;
  }

  /** 更新搜尋關鍵字 */
  onSearchKeywordInput(event: Event): void {
    this.searchKeyword = (event.target as HTMLInputElement).value;
  }


  /** 搜尋按鈕：彙整篩選條件後重新查詢（回到第一頁） */
  onSearch(): void {
    this.currentPage = 1;
    this.fetchLogs();
  }

  /** 切換頁碼：每次切頁都重新呼叫一次「後端」 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchLogs();
  }

  /**
   * 取得Log紀錄（目前為假資料模擬，之後請替換成真正的後端 API 呼叫）
   *
   * 之後串接 API 時，請求需帶入：
   *   - page：目前頁碼（this.currentPage）
   *   - pageSize：每頁筆數（this.pageSize，依畫面剩餘高度動態算出，每次都可能不同）
   *   - keyword／organizer／status／startDate／endDate：搜尋列篩選條件
   *
   * 後端需要做的事：
   *   1. 用 page + pageSize 算 offset，只回傳「該頁」的資料（data）
   *   2. 依篩選條件做查詢／過濾
   *   3. 回傳符合篩選條件後的「總筆數」(totalItems)，前端會用它換算總頁數與「共 N 筆」文字
   *      → 預期回應格式：{ data: AdminLogItem[]; totalItems: number }
   */
  private fetchLogs(): void {
    const keyword = this.searchKeyword.trim();
    const { startDate, endDate } = this.timeSelectorRef?.getTimeRange() ?? {
      startDate: null,
      endDate: null,
    };

    const filtered = this.mockLogs.filter((item) => {
      const matchKeyword = !keyword || item.operator.includes(keyword) || item.details.includes(keyword);
      const matchOprationType = !this.selectedOpration || item.actionType === this.selectedOpration;
      return matchKeyword && matchOprationType;
    });

    this.totalItems = filtered.length;

    const start = (this.currentPage - 1) * this.pageSize;
    this.logs = filtered.slice(start, start + this.pageSize);
  }

  /** 依表格容器目前的高度，重新計算一頁可顯示的列數 */
  private recalculatePageSize(): void {
    const wrapperHeight = this.resultSectionRef.nativeElement.clientHeight;
    const availableHeight = wrapperHeight - this.headerHeight;
    this.pageSize = Math.max(Math.floor(availableHeight / this.rowHeight), 1);
  }

  /** 取得狀態對應的標籤顏色 class */
  getOprationClass(status: string): string {
    return this.oprationColorMap[status] ?? 'grey';
  }

}
