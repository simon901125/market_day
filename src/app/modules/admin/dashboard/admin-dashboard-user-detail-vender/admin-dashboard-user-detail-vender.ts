import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../../core/services/alert.service';
import { UserStatus } from '../../../../models/status/UserStatus';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';
import { UserListItem } from '../../../../models/interface/admin/UserListItem';
import { AdminVendorDetail } from '../../../../models/interface/admin/AdminVendorDetail';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

/** 模擬後端回傳的攤主列表，串接 API 後可移除 */
const MOCK_VENDOR_USERS: UserListItem[] = [
  { id: 1, name: '李小花', email: 'flower@example.com', role: 'vendor', createdAt: '2021-03-15', lastLoginAt: '2026-06-20', status: '正常' },
  { id: 2, name: '陳阿明', email: 'aming@example.com', role: 'vendor', createdAt: '2022-07-01', lastLoginAt: '2025-12-01', status: '已停用' },
];

/** 模擬後端回傳的攤主詳情，串接 API 後可移除 */
const MOCK_DETAIL: AdminVendorDetail = {
  userId: 1,
  detail: {
    userInfo: {
      username: '李小花',
      role: 'vendor',
      email: 'flower@example.com',
      accountStatus: UserStatus.active,
      registeredAt: '2021-03-15 10:00',
      lastLoginAt: '2026-06-20 14:30',
      registrationCount: 0,
      completedEventCount: 3,
    },
    vendorInfo: {
      brandName: '小花手作',
      brandType: '手作',
      owner: '李小花',
      contactPhone: '0912-111-222',
      contactEmail: 'flower@example.com',
      contactAddress: '台中市西區民生路100號',
    },
    activityRegistrationRecords: {
      total: 9,
      items: [
        { activityName: '春語花市', registrationDate: '2026-04-01', registrationStatus: ApplicationStatus.completed, paymentStatus: PaymentStatus.paid, booth: 'A-01' },
        { activityName: '楓糖森活市集', registrationDate: '2026-05-10', registrationStatus: ApplicationStatus.pendingPayment, paymentStatus: PaymentStatus.pending, booth: null },
        { activityName: '月光甜點市集', registrationDate: '2026-06-01', registrationStatus: ApplicationStatus.pendingReview, paymentStatus: PaymentStatus.pending, booth: null },
        { activityName: '夏日手作市集', registrationDate: '2026-03-20', registrationStatus: ApplicationStatus.completed, paymentStatus: PaymentStatus.paid, booth: 'B-05' },
        { activityName: '秋風文創節', registrationDate: '2026-02-14', registrationStatus: ApplicationStatus.cancelled, paymentStatus: PaymentStatus.refunded, booth: null },
        { activityName: '冬暖聖誕市集', registrationDate: '2025-11-01', registrationStatus: ApplicationStatus.completed, paymentStatus: PaymentStatus.paid, booth: 'C-03' },
        { activityName: '新年好市集', registrationDate: '2025-12-05', registrationStatus: ApplicationStatus.reviewRejected, paymentStatus: PaymentStatus.pending, booth: null },
        { activityName: '綠意農夫市集', registrationDate: '2025-09-10', registrationStatus: ApplicationStatus.completed, paymentStatus: PaymentStatus.paid, booth: 'A-08' },
        { activityName: '草地音樂節', registrationDate: '2025-08-01', registrationStatus: ApplicationStatus.completed, paymentStatus: PaymentStatus.paid, booth: 'D-02' },
      ],
    },
    loginRecords: {
      total: 10,
      items: [
        { loginTime: '2026-06-20 14:30', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-18 09:12', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-06-15 22:05', loginMethod: 'Email', loginStatus: '失敗' },
        { loginTime: '2026-06-10 11:00', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-06-05 08:45', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-05-30 17:20', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-05-25 13:55', loginMethod: 'Google', loginStatus: '成功' },
        { loginTime: '2026-05-20 10:30', loginMethod: 'Email', loginStatus: '失敗' },
        { loginTime: '2026-05-15 16:00', loginMethod: 'Email', loginStatus: '成功' },
        { loginTime: '2026-05-10 07:50', loginMethod: 'Google', loginStatus: '成功' },
      ],
    },
  },
};

@Component({
  selector: 'app-admin-dashboard-user-detail-vender',
  imports: [CommonModule, DashboardPagination],
  templateUrl: './admin-dashboard-user-detail-vender.html',
  styleUrl: './admin-dashboard-user-detail-vender.scss',
})
export class AdminDashboardUserDetailVender implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alert: AlertService,
  ) {}

  readonly UserStatus = UserStatus;

  user: UserListItem | null = null;
  detail: AdminVendorDetail | null = null;

  loginCurrentPage = 1;
  readonly loginPageSize = 6;

  get loginRecordTotal(): number {
    return this.detail?.detail.loginRecords.total ?? 0;
  }

  get paginatedLoginRecords(): AdminVendorDetail['detail']['loginRecords']['items'] {
    const items = this.detail?.detail.loginRecords.items ?? [];
    const start = (this.loginCurrentPage - 1) * this.loginPageSize;
    return items.slice(start, start + this.loginPageSize);
  }

  onLoginPageChange(page: number): void {
    this.loginCurrentPage = page;
  }

  registrationCurrentPage = 1;
  readonly registrationPageSize = 8;

  get registrationRecordTotal(): number {
    return this.detail?.detail.activityRegistrationRecords.total ?? 0;
  }

  get paginatedRegistrationRecords(): AdminVendorDetail['detail']['activityRegistrationRecords']['items'] {
    const items = this.detail?.detail.activityRegistrationRecords.items ?? [];
    const start = (this.registrationCurrentPage - 1) * this.registrationPageSize;
    return items.slice(start, start + this.registrationPageSize);
  }

  onRegistrationPageChange(page: number): void {
    this.registrationCurrentPage = page;
  }

  ngOnInit(): void {
    const stateUser: UserListItem | undefined = history.state?.user;

    if (stateUser) {
      this.user = stateUser;
    } else {
      const id = Number(this.route.snapshot.params['id']);
      this.user = MOCK_VENDOR_USERS.find(u => u.id === id) ?? null;
    }

    if (this.user?.id === MOCK_DETAIL.userId) {
      this.detail = MOCK_DETAIL;
    }
  }

  get accountStatus(): string {
    return this.detail?.detail.userInfo.accountStatus ?? '';
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

  getRegistrationStatusClass(status: string): string {
    return ApplicationStatus.getClass(status);
  }

  getPaymentStatusClass(status: string): string {
    return PaymentStatus.getClass(status);
  }

  goBack(): void {
    this.router.navigate(['/admin/dash-board/users']);
  }

  async toggleAccountStatus(): Promise<void> {
    const username = this.detail?.detail.userInfo.username ?? '';
    const email = this.detail?.detail.userInfo.email ?? '';

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
      this.detail!.detail.userInfo.accountStatus = UserStatus.disabled;
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
      this.detail!.detail.userInfo.accountStatus = UserStatus.active;
      this.alert.success(
        '帳號已恢復',
        `使用者「${username}」 的帳號已成功恢復。<br />該帳號可重新登入系統並使用原本角色的相關功能。`,
      );
    }
  }

  onViewRecord(_record: AdminVendorDetail['detail']['activityRegistrationRecords']['items'][number]): void {
    // TODO: 導向活動報名詳情頁
  }
}
