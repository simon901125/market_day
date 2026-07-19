import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserType } from '../../../../models/type/UserType';
import { UserListItem } from '../../../../models/interface/admin/UserListItem';
import { AdminUserListDto, AdminUserSearchRequest } from '../../../../models/interface/admin/AdminUserSearch';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { ClickableTableRowDirective } from '../../../shared/dashboard/clickable-table-row/clickable-table-row.directive';

@Component({
  selector: 'app-admin-dashboard-user-management',
  imports: [
    Dropdown,
    DashboardPagination,
    ClickableTableRowDirective,
  ],
  templateUrl: './admin-dashboard-user-management.html',
  styleUrl: './admin-dashboard-user-management.scss',
})
export class AdminDashboardUserManagement implements AfterViewInit{

  constructor(
    private router: Router,
    private readonly adminApiService: AdminApiService,
    private readonly alert: AlertService,
  ) {}

  @ViewChild('roleDropdown') roleDropdownRef!: Dropdown;
  @ViewChild('statusDropdown') statusDropdownRef!: Dropdown;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('resultSection') resultSectionRef!: ElementRef<HTMLDivElement>;


  /** 每列高度，需與 SCSS `.activity-table tbody tr` 的高度一致 */
  private readonly rowHeight = 56;
  /** 表頭高度，需與 SCSS `.activity-table thead tr` 的高度一致 */
  private readonly headerHeight = 48;

  /** 使用者帳號狀態下拉選單 */
  userStatusOptions: string[] = [
    '全部',
    UserStatus.active,
    UserStatus.disabled,
  ];

  /** 帳號角色下拉選單 */
  roleOptions: string[] = [
    '全部',
    UserType.vendor,
    UserType.organizer,
  ];

  /** 目前篩選條件：帳號角色 */
  private selectedRole = '';
  /** 目前篩選條件：帳號狀態 */
  private selectedStatus = '';
  /** 目前輸入的搜尋關鍵字 */
  searchKeyword = '';

  /** 目前頁面顯示的活動列表（已套用篩選＋分頁） */
  users: UserListItem[] = [];

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
      this.fetchUsers();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const previousPageSize = this.pageSize;
    this.recalculatePageSize();

    if (this.pageSize !== previousPageSize) {
      this.currentPage = 1;
      this.fetchUsers();
    }
  }

  onRoleSelected(value: string): void {
    this.selectedRole = value === '全部' ? '' : value;
  }

  onStatusSelected(value: string): void {
    this.selectedStatus = value === '全部' ? '' : value;
  }

  /** 更新搜尋關鍵字 */
  onSearchKeywordInput(event: Event): void {
    this.searchKeyword = (event.target as HTMLInputElement).value;
  }

  /** 搜尋按鈕：彙整篩選條件後重新查詢（回到第一頁） */
  onSearch(): void {
    this.currentPage = 1;
    this.fetchUsers();
  }

  /** 切換頁碼：每次切頁都重新呼叫一次「後端」 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

    /** 產生操作欄位按鈕的點擊處理函式，導向使用者詳細頁 */
    getDetailHandler(user: UserListItem): () => void {
      return () => this.goToDetail(user, user.role);
    }

    getDetailRoute(user: UserListItem): any[] {
      const detailType = user.role === UserType.organizer ? 'organizer' : 'vender';
      return ['/admin/dash-board/user/detail', detailType, user.id];
    }
  
    private goToDetail(user: UserListItem, role: String): void {
      if (role == UserType.organizer) {
        this.router.navigate(['/admin/dash-board/user/detail/organizer', user.id], {
          state: { user },
        });
      } else {
        this.router.navigate(['/admin/dash-board/user/detail/vender', user.id], {
          state: { user },
        });
      }
    }

  /**
   * 串接 API："/api/admin/users/search"，依搜尋列篩選條件與目前頁碼查詢使用者列表
   */
  private fetchUsers(): void {
    const keyword = this.searchKeyword.trim();

    const request: AdminUserSearchRequest = {
      keyWord: keyword || null,
      role: this.selectedRole ? UserType.toApiRole(this.selectedRole) : null,
      status: this.selectedStatus ? UserStatus.toApiStatus(this.selectedStatus) : null,
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
    };

    this.adminApiService.searchUsers(request).subscribe({
      next: async (res) => {
        if (!isApiSuccessStatus(res.statusCode)) {
          await this.alert.error('查詢失敗', res.message);
          return;
        }

        this.users = res.data.items.map((item) => this.mapUserListItem(item));
        this.totalItems = res.data.totalItems;
      },
      error: async (error) => {
        await this.alert.error('查詢失敗', error.error?.message || '請稍後再試。');
      },
    });
  }

  /** 把 API 回傳的使用者列表項目轉成畫面用的 UserListItem */
  private mapUserListItem(item: AdminUserListDto): UserListItem {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      role: UserType.fromApiRole(item.role),
      createdAt: item.regAt,
      lastLoginAt: item.lastLoginAt,
      status: UserStatus.fromApiStatus(item.status),
    };
  }

  /** 依表格容器目前的高度，重新計算一頁可顯示的列數 */
  private recalculatePageSize(): void {
    this.pageSize = 6;
  }

  /** 取得角色的標籤顏色 class */
  getRoleClass(role: string): string {
    return UserType.getClass(role);
  }

  /** 取得帳號狀態對應的標籤顏色 class */
  getStatusClass(status: string): string {
    return UserStatus.getClass(status);
  }

  /** 統一管理列表日期時間格式；API 已回傳 yyyy/MM/dd HH:mm 格式，僅補上缺漏時間。 */
  formatDateTime(value: string): string {
    const normalized = (value ?? '').trim().replace('T', ' ');
    if (!normalized) return '-';

    const [date, time = '00:00'] = normalized.split(/\s+/, 2);
    return `${date.replaceAll('-', '/')} ${time.slice(0, 5)}`;
  }

}

