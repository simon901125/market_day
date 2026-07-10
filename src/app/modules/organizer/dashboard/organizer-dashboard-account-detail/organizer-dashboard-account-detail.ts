import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

interface StatItem {
  label: string;
  value: string;
}

interface LedgerRow {
  id: number;
  paymentNo: string;
  brandName: string;
  vendorName: string;
  boothNo: string;
  paidAt: string;
  paymentAmount: string;
  refundAmount: string;
  depositStatus: string;
  depositStatusClass: string;
  accountStatus: string;
  accountStatusClass: string;
}

interface AccountDetail {
  id: number;
  activityName: string;
  activityImage: string;
  activityStatus: string;
  activityStatusClass: string;
  activityDate: string;
  activityLocation: string;
  totalBooths: string;
  paidBooths: string;
  summary: StatItem[];
  netAmount: string;
  paymentStats: StatItem[];
  refundStats: StatItem[];
  depositStats: StatItem[];
  ledgerRows: LedgerRow[];
}

@Component({
  selector: 'app-organizer-dashboard-account-detail',
  imports: [RouterLink, DashboardPagination],
  templateUrl: './organizer-dashboard-account-detail.html',
  styleUrl: './organizer-dashboard-account-detail.scss',
})
export class OrganizerDashboardAccountDetail implements OnInit {
  returnPage = 1;
  returnStatus = '';
  selectedTab = '全部';
  ledgerPage = 1;
  readonly ledgerPageSize = 5;
  detail!: AccountDetail;

  readonly tabOptions = ['全部', '付款成功', '退款申請中', '退款處理中', '已退款', '已取消'];

  readonly details: AccountDetail[] = [
    this.createDetail(1, {
      activityName: '夏日綠意市集',
      activityStatus: ActivityStatus.registrationOpen,
      activityDate: '2026/07/18 - 2026/07/19',
      activityLocation: '台北市信義區香堤大道廣場',
      totalBooths: '60 攤',
      paidBooths: '28 攤',
      netAmount: '$73,600',
    }),
    this.createDetail(2, {
      activityName: '秋日手作市集',
      activityStatus: '待選位',
      activityDate: '2026/09/12 - 2026/09/13',
      activityLocation: '台北市大同區延平河濱公園',
      totalBooths: '70 攤',
      paidBooths: '35 攤',
      netAmount: '$116,400',
    }),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? 1);
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('returnPage'));
    this.returnPage = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';
    this.detail = this.details.find((item) => item.id === id) ?? this.details[0];
  }

  get filteredLedgerRows(): LedgerRow[] {
    if (this.selectedTab === '全部') {
      return this.detail.ledgerRows;
    }

    return this.detail.ledgerRows.filter((row) => row.accountStatus === this.selectedTab);
  }

  get pagedLedgerRows(): LedgerRow[] {
    const startIndex = (this.ledgerPage - 1) * this.ledgerPageSize;
    return this.filteredLedgerRows.slice(startIndex, startIndex + this.ledgerPageSize);
  }

  get ledgerTotalItems(): number {
    return this.filteredLedgerRows.length;
  }

  get grossAmount(): string {
    return this.detail.summary[0]?.value ?? '-';
  }

  get refundTotal(): string {
    return this.detail.summary[1]?.value ?? '-';
  }

  get returnedDeposit(): string {
    return this.detail.summary[2]?.value ?? '-';
  }

  get forfeitedDeposit(): string {
    return this.detail.summary[3]?.value ?? '-';
  }

  get tabLabels(): { label: string; count: number }[] {
    return this.tabOptions.map((label) => ({
      label,
      count: label === '全部' ? this.detail.ledgerRows.length : this.detail.ledgerRows.filter((row) => row.accountStatus === label).length,
    }));
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.ledgerPage = 1;
  }

  onLedgerPageChange(page: number): void {
    this.ledgerPage = page;
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/account'], {
      queryParams: {
        page: this.returnPage,
        status: this.returnStatus || null,
      },
    });
  }

  viewCollectionDetail(row: LedgerRow): void {
    this.router.navigate(['/organizer/dash-board/collection/detail', row.id]);
  }

  downloadAccountReport(): void {
    // TODO: 串接帳務報表匯出 API 或前端 Excel 產生流程。
  }

  private createDetail(id: number, overrides: Partial<AccountDetail>): AccountDetail {
    const ledgerRows: LedgerRow[] = [
      this.createLedgerRow(1, 'PAY202607180001', '綠野小農', '林小森', 'A01', '2026/06/20　14:32', '$3,600', '$0', '已退還', '付款成功'),
      this.createLedgerRow(2, 'PAY202607180002', '森活手作', '陳小米', 'A02', '2026/06/21　10:15', '$3,600', '$0', '已退還', '付款成功'),
      this.createLedgerRow(3, 'REF202607180003', '小葉甜品', '周植植', 'A03', '2026/06/22　09:41', '$3,600', '$3,600', '已退還', '已退款'),
      this.createLedgerRow(4, 'PAY202607180004', '花見飾品', '林花見', 'A04', '2026/06/23　11:03', '$3,600', '$0', '未退還', '退款申請中'),
      this.createLedgerRow(5, 'REF202607180005', '日光植栽', '日光子', 'A05', '2026/06/24　16:20', '$3,600', '$3,600', '未退還', '退款處理中'),
      this.createLedgerRow(6, 'PAY202607180006', '午後陶作', '黃午後', 'A06', '2026/06/25　13:10', '$3,600', '$0', '未退還', '已取消'),
    ];

    return {
      id,
      activityName: '夏日綠意市集',
      activityImage: `assets/images/market/cards/market-card-0${Math.min(id, 8)}.png`,
      activityStatus: ActivityStatus.registrationOpen,
      activityDate: '2026/07/18 - 2026/07/19',
      activityLocation: '台北市信義區香堤大道廣場',
      totalBooths: '60 攤',
      paidBooths: '28 攤',
      summary: [
        { label: '收款總額', value: '$100,800' },
        { label: '退款總額', value: '$7,200' },
        { label: '已退保證金', value: '$20,000' },
        { label: '沒收保證金', value: '$8,000' },
      ],
      netAmount: '$73,600',
      paymentStats: [
        { label: '總攤位數', value: '60' },
        { label: '已付款攤位數', value: '28' },
        { label: '待付款攤位數', value: '3' },
        { label: '付款成功筆數', value: '28' },
      ],
      refundStats: [
        { label: '退款筆數', value: '2' },
        { label: '退款總額', value: '$7,200' },
        { label: '退款完成筆數', value: '1' },
        { label: '退款處理中', value: '1' },
      ],
      depositStats: [
        { label: '收取保證金總額', value: '$28,000' },
        { label: '已退還保證金', value: '$20,000' },
        { label: '未退還保證金', value: '$8,000' },
        { label: '退還筆數', value: '20' },
      ],
      ledgerRows,
      ...overrides,
      activityStatusClass: this.getActivityStatusClass(overrides.activityStatus ?? ActivityStatus.registrationOpen),
    };
  }

  private createLedgerRow(
    id: number,
    paymentNo: string,
    brandName: string,
    vendorName: string,
    boothNo: string,
    paidAt: string,
    paymentAmount: string,
    refundAmount: string,
    depositStatus: string,
    accountStatus: string,
  ): LedgerRow {
    return {
      id,
      paymentNo,
      brandName,
      vendorName,
      boothNo,
      paidAt,
      paymentAmount,
      refundAmount,
      depositStatus,
      depositStatusClass: this.getDepositClass(depositStatus),
      accountStatus,
      accountStatusClass: PaymentStatus.classMap[accountStatus] ?? 'tag-grey',
    };
  }

  private getDepositClass(status: string): string {
    if (status === '已退還') {
      return 'tag-green';
    }

    if (status === '未退還') {
      return 'tag-blue';
    }

    return '';
  }

  private getActivityStatusClass(status: string): string {
    if (status === '待選位') {
      return 'tag-blue';
    }

    return ActivityStatus.getClass(status);
  }
}

