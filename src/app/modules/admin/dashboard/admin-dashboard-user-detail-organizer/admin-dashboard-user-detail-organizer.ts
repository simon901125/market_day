import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserListItem } from '../../../../models/interface/admin/UserListItem';
import { AdminOrganizerDetail } from '../../../../models/interface/admin/AdminOrganizerDetail';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

/** 模擬後端回傳的主辦方列表，串接 API 後可移除 */
const MOCK_ORGANIZER_USERS: UserListItem[] = [
  { id: 3,  name: '王曉三', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2026-05-30', status: '正常' },
  { id: 7,  name: '王曉三', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2026-05-30', status: '正常' },
  { id: 11, name: '王曉三', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2026-05-30', status: '正常' },
  { id: 15, name: '王曉三', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2026-05-30', status: '正常' },
  { id: 19, name: '王曉三', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2026-05-30', status: '正常' },
  { id: 4,  name: '王曉四', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2024-05-30', status: '已停用' },
  { id: 8,  name: '王曉四', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2024-05-30', status: '已停用' },
  { id: 12, name: '王曉四', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2024-05-30', status: '已停用' },
  { id: 16, name: '王曉四', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2024-05-30', status: '已停用' },
  { id: 20, name: '王曉四', email: 'Test@gmail.com', role: 'organizer', createdAt: '2020-01-01', lastLoginAt: '2024-05-30', status: '已停用' },
];

/** 模擬後端回傳的主辦方詳情，串接 API 後可移除 */
const MOCK_DETAIL: AdminOrganizerDetail = {
  userId: 3,
  data: {
    userInfo: {
      username: '王曉三',
      role: 'organizer',
      email: 'wang3@example.com',
      accountStatus: UserStatus.active,
      registeredAt: '2020-01-01 10:00',
      lastLoginAt: '2026-06-20 09:15',
      createdActivityCount: 8,
      ongoingActivityCount: 2,
      endedActivityCount: 6,
    },
    organizerInfo: {
      organizerName: '春語市集',
      contactPerson: '王曉三',
      contactPhone: '0912-345-678',
      contactEmail: 'wang3@example.com',
      contactAddress: '台北市大安區忠孝東路四段127號8樓',
      companyName: '春語文化有限公司',
      taxId: '12345678',
      organizerStatus: '審核通過',
    },
    activityManagementRecords: {
      total: 9,
      items: [
        { activityName: '春語花市', activityDate: '2026-05-01 ~ 2026-05-02', activityStatus: '已結束', registrationCount: '150/150' },
        { activityName: '楓糖森活市集', activityDate: '2026-06-05 ~ 2026-06-06', activityStatus: '進行中', registrationCount: '88/120' },
        { activityName: '月光甜點市集', activityDate: '2026-11-12 ~ 2026-11-13', activityStatus: '待審核', registrationCount: '0/100' },
        { activityName: '春語花市', activityDate: '2026-05-01 ~ 2026-05-02', activityStatus: '已結束', registrationCount: '150/150' },
        { activityName: '楓糖森活市集', activityDate: '2026-06-05 ~ 2026-06-06', activityStatus: '進行中', registrationCount: '88/120' },
        { activityName: '月光甜點市集', activityDate: '2026-11-12 ~ 2026-11-13', activityStatus: '待審核', registrationCount: '0/100' },
        { activityName: '春語花市', activityDate: '2026-05-01 ~ 2026-05-02', activityStatus: '已結束', registrationCount: '150/150' },
        { activityName: '楓糖森活市集', activityDate: '2026-06-05 ~ 2026-06-06', activityStatus: '進行中', registrationCount: '88/120' },
        { activityName: '月光甜點市集', activityDate: '2026-11-12 ~ 2026-11-13', activityStatus: '待審核', registrationCount: '0/100' },
      ],
    },
    loginRecords: {
      total: 10,
      items: [
        { loginTime: '2026-06-20 09:15', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-18 14:32', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-06-15 08:00', loginMethod: 'Email', loginStatus: '失敗' },
        { loginTime: '2026-06-10 20:45', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-05 11:00', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-06-20 09:15', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-18 14:32', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-06-15 08:00', loginMethod: 'Email', loginStatus: '失敗' },
        { loginTime: '2026-06-10 20:45', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-05 11:00', loginMethod: 'Google', loginStatus: '成功' },
      ],
    },
  },
};

@Component({
  selector: 'app-admin-dashboard-user-detail-organizer',
  imports: [CommonModule, DashboardPagination],
  templateUrl: './admin-dashboard-user-detail-organizer.html',
  styleUrl: './admin-dashboard-user-detail-organizer.scss',
})
export class AdminDashboardUserDetailOrganizer implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
  ) {}

  readonly UserStatus = UserStatus;

  user: UserListItem | null = null;
  detail: AdminOrganizerDetail | null = null;

  loginCurrentPage = 1;
  readonly loginPageSize = 6;

  get loginRecordTotal(): number {
    return this.detail?.data.loginRecords.total ?? 0;
  }

  get paginatedLoginRecords(): AdminOrganizerDetail['data']['loginRecords']['items'] {
    const items = this.detail?.data.loginRecords.items ?? [];
    const start = (this.loginCurrentPage - 1) * this.loginPageSize;
    return items.slice(start, start + this.loginPageSize);
  }

  onLoginPageChange(page: number): void {
    this.loginCurrentPage = page;
  }

  activityCurrentPage = 1;
  readonly activityPageSize = 8;

  get activityRecordTotal(): number {
    return this.detail?.data.activityManagementRecords.total ?? 0;
  }

  get paginatedActivityRecords(): AdminOrganizerDetail['data']['activityManagementRecords']['items'] {
    const items = this.detail?.data.activityManagementRecords.items ?? [];
    const start = (this.activityCurrentPage - 1) * this.activityPageSize;
    return items.slice(start, start + this.activityPageSize);
  }

  onActivityPageChange(page: number): void {
    this.activityCurrentPage = page;
  }

  ngOnInit(): void {
    const stateUser: UserListItem | undefined = history.state?.user;

    if (stateUser) {
      this.user = stateUser;
    } else {
      const id = Number(this.route.snapshot.params['id']);
      this.user = MOCK_ORGANIZER_USERS.find(u => u.id === id) ?? null;
    }

    // 取得 userId 後呼叫 API，目前以假資料替代
    if (this.user?.id === MOCK_DETAIL.userId) {
      this.detail = MOCK_DETAIL;
    }
  }

  get accountStatus(): string {
    return this.detail?.data.userInfo.accountStatus ?? '';
  }

  get isAccountActive(): boolean {
    return this.accountStatus === UserStatus.active;
  }

  getStatusClass(status: string): string {
    if (status === UserStatus.active) return 'green';
    if (status === UserStatus.disabled) return 'red';
    return 'grey';
  }

  getLoginStatusClass(status: string): string {
    if (status === '成功') return 'green';
    if (status === '失敗') return 'red';
    return 'grey';
  }

  getActivityStatusClass(status: string): string {
    const map: Record<string, string> = {
      '進行中': 'green',
      '已結束': 'grey',
      '待審核': 'orange',
      '補件中': 'red',
      '已發布': 'blue',
      '報名中': 'teal',
    };
    return map[status] ?? 'grey';
  }

  goBack(): void {
    this.router.navigate(['/admin/dash-board/users']);
  }

  async toggleAccountStatus(): Promise<void> {
    const username = this.detail?.data.userInfo.username ?? '';
    const email = this.detail?.data.userInfo.email ?? '';

    if (this.isAccountActive) {
      const confirmed = await this.alert.confirmHtml({
        html: `
          <div class="restore-confirm-content">
            <div class="restore-confirm-icon"><i class="bi bi-exclamation-circle"></i></div>
            <h3>停用帳號確認</h3>
            <p>確定要停用使用者「${username}」(${email})的帳號嗎？</p>
            <div class="restore-confirm-effects">
              <ul>
                <li>該帳號將無法登入管理後台與使用相關功能</li>
                <li>進行中的活動或報名資料不會被刪除</li>
                <li>可隨時在使用者管理頁面中恢復該帳號</li>
              </ul>
            </div>
          </div>
        `,
        confirmButtonText: '確認停用',
        cancelButtonText: '取消',
        popupClass: 'restore-confirm-swal',
      });
      if (!confirmed) return;
      // TODO: 呼叫後端 API 將帳號狀態改為「已停用」
      this.detail!.data.userInfo.accountStatus = UserStatus.disabled;
      this.alert.success(
        '帳號已停用',
        `使用者「${username}」 的帳號已成功停用。 <br />停用期間將無法登入系統，且無法進行報名、付款及其他操作。`,
      );
    } else {
      const confirmed = await this.alert.confirmHtml({
        html: `
          <div class="restore-confirm-content">
            <div class="restore-confirm-icon"><i class="bi bi-exclamation-circle"></i></div>
            <h3>恢復帳號確認</h3>
            <p>確定要恢復使用者「${username}」(${email})的帳號嗎？</p>
            <div class="restore-confirm-effects">
              <ul>
                <li>該帳號可重新登入系統</li>
                <li>可繼續使用原本角色的相關功能</li>
                <li>原有資料與紀錄將保留</li>
              </ul>
            </div>
          </div>
        `,
        confirmButtonText: '確認恢復',
        cancelButtonText: '取消',
        popupClass: 'restore-confirm-swal',
      });
      if (!confirmed) return;
      // TODO: 呼叫後端 API 將帳號狀態改為「正常」
      this.detail!.data.userInfo.accountStatus = UserStatus.active;
      this.alert.success(
        '帳號已恢復',
        `使用者「${username}」 的帳號已成功恢復。<br />該帳號可重新登入系統並使用原本角色的相關功能。`,
      );
    }
  }

  onViewActivity(_record: AdminOrganizerDetail['data']['activityManagementRecords']['items'][number]): void {
    // TODO: 導向活動詳情頁
  }

}
