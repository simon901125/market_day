import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  data: {
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
  ) {}

  readonly UserStatus = UserStatus;

  user: UserListItem | null = null;
  detail: AdminVendorDetail | null = null;

  loginCurrentPage = 1;
  readonly loginPageSize = 6;

  get loginRecordTotal(): number {
    return this.detail?.data.loginRecords.total ?? 0;
  }

  get paginatedLoginRecords(): AdminVendorDetail['data']['loginRecords']['items'] {
    const items = this.detail?.data.loginRecords.items ?? [];
    const start = (this.loginCurrentPage - 1) * this.loginPageSize;
    return items.slice(start, start + this.loginPageSize);
  }

  onLoginPageChange(page: number): void {
    this.loginCurrentPage = page;
  }

  registrationCurrentPage = 1;
  readonly registrationPageSize = 8;

  get registrationRecordTotal(): number {
    return this.detail?.data.activityRegistrationRecords.total ?? 0;
  }

  get paginatedRegistrationRecords(): AdminVendorDetail['data']['activityRegistrationRecords']['items'] {
    const items = this.detail?.data.activityRegistrationRecords.items ?? [];
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

  getRegistrationStatusClass(status: string): string {
    return ApplicationStatus.getClass(status);
  }

  getPaymentStatusClass(status: string): string {
    return PaymentStatus.getClass(status);
  }

  goBack(): void {
    this.router.navigate(['/admin/dash-board/users']);
  }

  toggleAccountStatus(): void {
    // TODO: 呼叫後端 API 切換帳號狀態
  }

  onViewRecord(_record: AdminVendorDetail['data']['activityRegistrationRecords']['items'][number]): void {
    // TODO: 導向活動報名詳情頁
  }
}
