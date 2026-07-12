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
  @ViewChild('operationDropdown') operationDropdownRef!: Dropdown;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('resultSection') resultSectionRef!: ElementRef<HTMLDivElement>;


  /** 每列高度，需與 SCSS `.activity-table tbody tr` 的高度一致 */
  private readonly rowHeight = 56;
  /** 表頭高度，需與 SCSS `.activity-table thead tr` 的高度一致 */
  private readonly headerHeight = 48;

  /** 操作類型下拉選單*/
  operationOptions: string[] = [
    "全部",
    OperationType.activityReview,
    OperationType.requestRevision,
    OperationType.accountRestored,
    OperationType.accountDisabled,
    OperationType.systemSetting,
  ];

  /** 操作對象角色篩選選項。 */
  targetRoleOptions: string[] = ['全部', '主辦方', '攤主'];

  /** 操作類型 -> 標籤顏色 class 對應 */
  private readonly operationColorMap: Record<string, string> = {
    [OperationType.activityReview]: 'admin-blue',
    [OperationType.requestRevision]: 'admin-orange',
    [OperationType.accountRestored]: 'admin-green',
    [OperationType.accountDisabled]: 'admin-red',
    [OperationType.systemSetting]: 'admin-purple',
  };

  /** 假資料：操作對象統一使用攤主姓名或主辦方名稱。 */
  private readonly mockLogs: AdminLogItem[] = ([
    { id: 1, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '森林生活市集', details: '操作內容'},
    { id: 2, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountRestored, target: '王曉明', details: '操作內容'},
    { id: 3, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '日日好市', details: '操作內容'},
    { id: 4, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.requestRevision, target: '春光小日子', details: '操作內容'},
    { id: 5, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '陳怡君', details: '操作內容'},
    { id: 6, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '歡樂市集團隊', details: '操作內容'},
    { id: 7, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.requestRevision, target: '森林生活市集', details: '操作內容'},
    { id: 8, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.systemSetting, target: '林美玲', details: '操作內容'},
    { id: 9, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountRestored, target: '張家豪', details: '操作內容'},
    { id: 10, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '日日好市', details: '操作內容'},
    { id: 11, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '春光小日子', details: '操作內容'},
    { id: 12, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.requestRevision, target: '歡樂市集團隊', details: '操作內容'},
    { id: 13, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '森林生活市集', details: '操作內容'},
    { id: 14, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.systemSetting, target: '李佳穎', details: '操作內容'},
    { id: 15, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '日日好市', details: '操作內容'},
    { id: 16, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.requestRevision, target: '春光小日子', details: '操作內容'},
    { id: 17, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.activityReview, target: '歡樂市集團隊', details: '操作內容'},
    { id: 18, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '黃筱雯', details: '操作內容'},
    { id: 19, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '周承恩', details: '操作內容'},
    { id: 20, createdAt: '2026/01/01', operator: '管理員A', actionType: OperationType.accountDisabled, target: '吳品妍', details: '操作內容'},
    
  ] as Array<Omit<AdminLogItem, 'targetRole' | 'targetEmail'>>).map((log) => ({
    ...log,
    ...this.getMockTargetIdentity(log.target),
  }));

  /** 目前篩選條件：操作類型 */
  private selectedOperation = '';
  /** 目前篩選條件：操作對象角色。 */
  private selectedTargetRole: '' | AdminLogItem['targetRole'] = '';
  /** 目前輸入的搜尋關鍵字 */
  searchKeyword = '';

  /** 目前頁面顯示的活動列表（已套用篩選＋分頁） */
  logs: AdminLogItem[] = [];

  /** 目前頁碼 */
  currentPage = 1;
  /** 每頁筆數，依畫面剩餘高度動態計算（見 Task 8），初始為合理預設值 */
  /** 管理頁統一每頁顯示 6 筆。 */
  pageSize = 6;
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

  onOperationSelected(value: string): void {
    this.selectedOperation = value === "全部" ? '' : value;
  }

  onTargetRoleSelected(value: string): void {
    this.selectedTargetRole = value === '主辦方' || value === '攤主' ? value : '';
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
   *   - keyword／actionType／targetRole／startDate／endDate：搜尋列篩選條件
   *   - target 必須是攤主姓名或主辦方名稱，不使用活動名稱或泛稱
   *   - targetRole 回傳「主辦方」或「攤主」；targetEmail 回傳操作當下的 Email 快照
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
      const matchKeyword = !keyword
        || item.operator.includes(keyword)
        || item.target.includes(keyword)
        || item.targetEmail.includes(keyword)
        || item.details.includes(keyword);
      const matchOperationType = !this.selectedOperation || item.actionType === this.selectedOperation;
      const matchTargetRole = !this.selectedTargetRole || item.targetRole === this.selectedTargetRole;
      return matchKeyword && matchOperationType && matchTargetRole;
    });

    this.totalItems = filtered.length;

    const start = (this.currentPage - 1) * this.pageSize;
    this.logs = filtered.slice(start, start + this.pageSize);
  }

  /** 依表格容器目前的高度，重新計算一頁可顯示的列數 */
  private recalculatePageSize(): void {
    this.pageSize = 6;
  }

  /** 取得狀態對應的標籤顏色 class */
  getOperationClass(status: string): string {
    return this.operationColorMap[status] ?? 'grey';
  }

  /** 統一操作時間格式；API 僅回傳日期時補上 00:00。 */
  formatDateTime(value: string): string {
    const normalized = value.trim().replace('T', ' ');
    if (!normalized) return '-';

    const [date, time = '00:00'] = normalized.split(/\s+/, 2);
    return `${date.replaceAll('-', '/')} ${time.slice(0, 5)}`;
  }

  /** 假資料用身分快照；正式 API 應直接回傳 targetRole 與 targetEmail。 */
  private getMockTargetIdentity(target: string): Pick<AdminLogItem, 'targetRole' | 'targetEmail'> {
    const vendorEmails: Record<string, string> = {
      王曉明: 'xiaoming.wang@example.com',
      陳怡君: 'yijun.chen@example.com',
      林美玲: 'meiling.lin@example.com',
      張家豪: 'jiahao.zhang@example.com',
      李佳穎: 'jiaying.li@example.com',
      黃筱雯: 'xiaowen.huang@example.com',
      周承恩: 'chengen.zhou@example.com',
      吳品妍: 'pinyan.wu@example.com',
    };

    if (vendorEmails[target]) {
      return { targetRole: '攤主', targetEmail: vendorEmails[target] };
    }

    const organizerEmails: Record<string, string> = {
      森林生活市集: 'forest.market@example.com',
      日日好市: 'daily.market@example.com',
      春光小日子: 'spring.market@example.com',
      歡樂市集團隊: 'happy.market@example.com',
    };
    return { targetRole: '主辦方', targetEmail: organizerEmails[target] ?? '-' };
  }

}

