import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserType } from '../../../../models/type/UserType';
import { UserListItem } from '../../../../models/interface/admin/UserListItem';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

@Component({
  selector: 'app-admin-dashboard-user-management',
  imports: [
    Dropdown,
    DashboardPagination,
  ],
  templateUrl: './admin-dashboard-user-management.html',
  styleUrl: './admin-dashboard-user-management.scss',
})
export class AdminDashboardUserManagement implements AfterViewInit{
  
  constructor(private router: Router) {}

  @ViewChild('roleDropdown') roleDropdownRef!: Dropdown;
  @ViewChild('statusDropdown') statusDropdownRef!: Dropdown;
  @ViewChild('tableWrapper') tableWrapperRef!: ElementRef<HTMLDivElement>;

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

  /** 使用者帳號狀態 -> 標籤顏色 class 對應 */
  private readonly userStatusColorMap: Record<string, string> = {
    [UserStatus.active]: 'green',
    [UserStatus.disabled]: 'red',
  };

  /** 帳號角色下拉選單 */
  roleOptions: string[] = [
    '全部',
    UserType.vendor,
    UserType.organizer,
  ];

  /** 帳號角色 -> 標籤顏色 class 對應 */
  private readonly roleColorMap: Record<string, string> = {
    [UserType.vendor]: 'purple',
    [UserType.organizer]: 'blue',
  };

  /** 假資料：模擬後端回傳的使用者列表，之後可替換成真正的 API 呼叫結果 */
  private readonly mockUsers: UserListItem[] = [
    {id:1, name:"王曉一", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:2, name:"王曉二", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled },
    {id:3, name:"王曉三", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:4, name:"王曉四", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled }, 
    {id:5, name:"王曉一", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:6, name:"王曉二", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled },
    {id:7, name:"王曉三", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:8, name:"王曉四", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled }, 
    {id:9, name:"王曉一", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:10, name:"王曉二", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled },
    {id:11, name:"王曉三", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:12, name:"王曉四", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled }, 
    {id:13, name:"王曉一", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:14, name:"王曉二", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled },
    {id:15, name:"王曉三", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:16, name:"王曉四", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled }, 
    {id:17, name:"王曉一", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:18, name:"王曉二", email:"Test@gmail.com", role:UserType.vendor, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled },
    {id:19, name:"王曉三", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2026-05-30", status:UserStatus.active },
    {id:20, name:"王曉四", email:"Test@gmail.com", role:UserType.organizer, createdAt:"2020-01-01", lastLoginAt:"2024-05-30", status:UserStatus.disabled }, 
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
  pageSize = 8;
  /** 篩選後的總筆數 */
  totalItems = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.recalculatePageSize();
      this.fetchusers();
    });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    const previousPageSize = this.pageSize;
    this.recalculatePageSize();

    if (this.pageSize !== previousPageSize) {
      this.currentPage = 1;
      this.fetchusers();
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
    this.fetchusers();
  }

  /** 切換頁碼：每次切頁都重新呼叫一次「後端」 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchusers();
  }

  //TODO:按鈕按下後的動作
    /** 產生操作欄位按鈕的點擊處理函式，導向使用者詳細頁 */
    getDetailHandler(user: UserListItem): () => void {
      return () => this.goToDetail(user, user.role);
    }
  
    private goToDetail(user: UserListItem, role: String): void {
      if (role == UserType.organizer) {        
        this.router.navigate(['/admin/dash-board/user/detail/organizer'], {
          state: { user },
        });
      } else {
        this.router.navigate(['/admin/dash-board/user/detail/vender'], {
          state: { user },
        });        
      }
    }

  /**
   * 取得活動列表（目前為假資料模擬，之後請替換成真正的後端 API 呼叫）
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
   *      → 預期回應格式：{ data: UserListItem[]; totalItems: number }
   *
   * 範例（替換時的寫法）：
   *   this.http.get<{ data: UserListItem[]; totalItems: number }>('/api/admin/users', {
   *     params: { page: this.currentPage, pageSize: this.pageSize, keyword, organizer: this.selectedRole, status: this.selectedStatus, startDate, endDate }
   *   }).subscribe(res => {
   *     this.users = res.data;
   *     this.totalItems = res.totalItems;
   *   });
   */
  private fetchusers(): void {
    const keyword = this.searchKeyword.trim();

    const filtered = this.mockUsers.filter((item) => {
      const matchKeyword = !keyword || item.name.includes(keyword);
      const matchRole = !this.selectedRole || item.role === this.selectedRole;
      const matchStatus = !this.selectedStatus || item.status === this.selectedStatus;
      return matchKeyword && matchRole && matchStatus;
    });

    this.totalItems = filtered.length;

    const start = (this.currentPage - 1) * this.pageSize;
    this.users = filtered.slice(start, start + this.pageSize);
  }

  /** 依表格容器目前的高度，重新計算一頁可顯示的列數 */
  private recalculatePageSize(): void {
    const wrapperHeight = this.tableWrapperRef.nativeElement.clientHeight;
    const availableHeight = wrapperHeight - this.headerHeight;
    this.pageSize = Math.max(Math.floor(availableHeight / this.rowHeight), 1);
  }

  /** 取得角色的標籤顏色 class */
  getRoleClass(status: string): string {
    return this.roleColorMap[status] ?? 'grey';
  }

  /** 取得帳號狀態對應的標籤顏色 class */
  getStatusClass(status: string): string {
    return this.userStatusColorMap[status] ?? 'grey';
  }

}
