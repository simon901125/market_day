import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerAccountingDetailResponse } from '../../../../models/interface/organizer/OrganizerOperations';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

interface StatItem { label: string; value: string; }
interface LedgerRow { id: number; paymentNo: string; brandName: string; vendorName: string; paidAt: string; paymentAmount: string; refundAmount: string; depositStatus: string; depositStatusClass: string; accountStatus: string; accountStatusClass: string; }
interface AccountDetail {
  id: number; activityName: string; activityImage: string; activityStatus: string; activityStatusClass: string;
  activityDate: string; activityLocation: string; activityAddress: string; totalBooths: string; paidBooths: string;
  summary: StatItem[]; netAmount: string; paymentStats: StatItem[]; refundStats: StatItem[]; depositStats: StatItem[]; ledgerRows: LedgerRow[];
}

@Component({ selector: 'app-organizer-dashboard-account-detail', imports: [RouterLink, DashboardPagination], templateUrl: './organizer-dashboard-account-detail.html', styleUrl: './organizer-dashboard-account-detail.scss' })
export class OrganizerDashboardAccountDetail implements OnInit {
  eventId = 0;
  returnPage = 1;
  returnStatus = '';
  selectedTab = '全部';
  ledgerPage = 1;
  readonly ledgerPageSize = 5;
  ledgerTotalItems = 0;
  detail: AccountDetail = this.emptyDetail();
  readonly tabOptions = ['全部', PaymentStatus.paid, PaymentStatus.refundRequested, PaymentStatus.refunding, PaymentStatus.refunded, '已取消'];

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly organizerApi: OrganizerApiService) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.returnPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('returnPage')) || 1);
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';
    if (this.eventId > 0) void this.loadDetail();
  }

  get pagedLedgerRows(): LedgerRow[] { return this.detail.ledgerRows; }
  get grossAmount(): string { return this.detail.summary[0]?.value ?? '-'; }
  get refundTotal(): string { return this.detail.summary[1]?.value ?? '-'; }
  get returnedDeposit(): string { return this.detail.summary[2]?.value ?? '-'; }
  get forfeitedDeposit(): string { return this.detail.summary[3]?.value ?? '-'; }
  get tabLabels(): { label: string; count: number }[] { return this.tabOptions.map((label) => ({ label, count: label === this.selectedTab ? this.ledgerTotalItems : 0 })); }

  selectTab(tab: string): void { this.selectedTab = tab; this.ledgerPage = 1; void this.loadDetail(); }
  onLedgerPageChange(page: number): void { this.ledgerPage = page; void this.loadDetail(); }
  goBack(): void { this.router.navigate(['/organizer/dash-board/account'], { queryParams: { page: this.returnPage, status: this.returnStatus || null } }); }
  viewCollectionDetail(row: LedgerRow): void { if (row.id > 0) this.router.navigate(['/organizer/dash-board/collection/detail', row.id]); }

  async downloadAccountReport(): Promise<void> {
    const blob = await firstValueFrom(this.organizerApi.downloadOrganizerAccountReport(this.eventId));
    this.saveBlob(blob, `帳務報表-${this.detail.activityName}.xlsx`);
  }

  private async loadDetail(): Promise<void> {
    try {
      const response = await firstValueFrom(this.organizerApi.getOrganizerAccountDetail(this.eventId, {
        status: this.selectedTab === '全部' ? undefined : this.selectedTab, paymentPage: this.ledgerPage, paymentPageSize: this.ledgerPageSize,
      }));
      this.applyResponse(response.data);
    } catch {
      this.detail.ledgerRows = []; this.ledgerTotalItems = 0;
    }
  }

  private applyResponse(data: OrganizerAccountingDetailResponse): void {
    const event = data.event; const summary = data.summary; const payment = data.statistics.payment; const refund = data.statistics.refund; const deposit = data.statistics.deposit;
    const activityStatus = ActivityStatus.fromApiStatus(this.text(event['publishStatusText'] || event['publishStatus']));
    this.ledgerTotalItems = data.payments?.totalItems ?? data.payments?.totalCount ?? 0;
    this.detail = {
      id: this.eventId,
      activityName: this.text(event['eventTitle']) || '-',
      activityImage: this.text(event['coverImageUrl']) || 'assets/images/market/cards/market-card-01.png',
      activityStatus, activityStatusClass: ActivityStatus.getClass(activityStatus),
      activityDate: this.text(event['eventDate']) || '-', activityLocation: this.text(event['locationName']) || '-', activityAddress: this.text(event['address']) || '-',
      totalBooths: `${event['totalStallCount'] ?? 0} 攤`, paidBooths: `${event['paidStallCount'] ?? 0} 攤`,
      summary: [
        { label: '收款總額', value: this.money(summary['grossRevenue']) }, { label: '退款總額', value: this.money(summary['refundAmount']) },
        { label: '已退保證金', value: this.money(summary['returnedDepositAmount']) }, { label: '未退還保證金', value: this.money(summary['unreturnedDepositAmount']) },
      ],
      netAmount: this.money(summary['netRevenue']),
      paymentStats: [
        { label: '總攤位數', value: String(payment['totalStallCount'] ?? 0) }, { label: '已付款攤位數', value: String(payment['paidStallCount'] ?? 0) },
        { label: '待付款攤位數', value: String(payment['pendingPaymentStallCount'] ?? 0) }, { label: '付款成功筆數', value: String(payment['paidStallCount'] ?? 0) },
      ],
      refundStats: [
        { label: '退款筆數', value: String(refund['refundCount'] ?? 0) }, { label: '退款總額', value: this.money(summary['refundAmount']) },
        { label: '退款完成筆數', value: String(refund['refundedCount'] ?? 0) }, { label: '退款處理中', value: String(refund['refundingCount'] ?? 0) },
      ],
      depositStats: [
        { label: '收取保證金總額', value: this.money((deposit['returnedDepositAmount'] ?? 0) + (deposit['unreturnedDepositAmount'] ?? 0)) },
        { label: '已退還保證金', value: this.money(deposit['returnedDepositAmount']) }, { label: '未退還保證金', value: this.money(deposit['unreturnedDepositAmount']) },
        { label: '退還筆數', value: String(deposit['returnedDepositCount'] ?? 0) },
      ],
      ledgerRows: (data.payments?.items ?? []).map((row) => this.mapLedger(row)),
    };
  }

  private mapLedger(row: Record<string, unknown>): LedgerRow {
    const accountStatus = PaymentStatus.fromApiStatus(this.text(row['accountingStatus']));
    const depositStatus = this.text(row['depositStatus']) || '-';
    return {
      id: Number(row['applicationId'] ?? row['paymentId'] ?? row['id'] ?? 0), paymentNo: this.text(row['paymentNo']) || '-', brandName: this.text(row['brandName']) || '-', vendorName: this.text(row['contactName']) || '-',
      paidAt: this.formatDateTime(row['paidAt']), paymentAmount: this.money(row['paymentAmount']), refundAmount: this.money(row['refundAmount']),
      depositStatus, depositStatusClass: depositStatus.includes('已退') ? 'tag-green' : 'tag-blue', accountStatus, accountStatusClass: PaymentStatus.getClass(accountStatus),
    };
  }

  private emptyDetail(): AccountDetail { return { id: 0, activityName: '-', activityImage: 'assets/images/market/cards/market-card-01.png', activityStatus: '-', activityStatusClass: 'tag-grey', activityDate: '-', activityLocation: '-', activityAddress: '-', totalBooths: '0 攤', paidBooths: '0 攤', summary: [{ label: '收款總額', value: '$0' }, { label: '退款總額', value: '$0' }, { label: '已退保證金', value: '$0' }, { label: '未退還保證金', value: '$0' }], netAmount: '$0', paymentStats: [{ label: '總攤位數', value: '0' }, { label: '已付款攤位數', value: '0' }, { label: '待付款攤位數', value: '0' }, { label: '付款成功筆數', value: '0' }], refundStats: [{ label: '退款筆數', value: '0' }, { label: '退款總額', value: '$0' }, { label: '退款完成筆數', value: '0' }, { label: '退款處理中', value: '0' }], depositStats: [{ label: '收取保證金總額', value: '$0' }, { label: '已退還保證金', value: '$0' }, { label: '未退還保證金', value: '$0' }, { label: '退還筆數', value: '0' }], ledgerRows: [] }; }
  private money(value: unknown): string { const number = Number(value ?? 0); return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(Number.isFinite(number) ? number : 0); }
  private text(value: unknown): string { return value == null ? '' : String(value); }
  private formatDateTime(value: unknown): string { const date = value ? new Date(String(value)) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('zh-TW', { hour12: false }) : '-'; }
  private saveBlob(blob: Blob, filename: string): void { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); }
}
