import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import { DepositStatus } from '../../../../models/status/DepositStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';
import { AlertService } from '../../../../core/services/alert.service';

interface DetailAction {
  key: 'approve-refund' | 'reject-refund' | 'refund-confirm';
  label: string;
  variant: 'primary' | 'outline' | 'danger';
}

interface StatusRecord {
  label: string;
  value: string;
  highlight?: boolean;
}

interface InfoRow {
  label: string;
  value: string;
  accent?: boolean;
  type?: 'status' | 'amount';
  statusClass?: string;
}

interface SummaryRow extends InfoRow {
  type?: 'status' | 'amount';
}

interface FeeRow {
  item: string;
  content: string;
  amount: string;
}

interface EquipmentRow {
  name: string;
  spec: string;
  quantity: string;
  unit?: string;
  price?: string;
  subtotal?: string;
}

interface ElectricityRow {
  spec: string;
  power: string;
  price?: string;
  subtotal?: string;
}

interface CollectionDetail {
  id: number;
  activityName: string;
  activityImage: string;
  activityStatus: string;
  activityDate: string;
  activityLocation: string;
  activityAddress: string;
  registrationStatus: string;
  paymentStatus: string;
  depositStatus?: string;
  registrationNo: string;
  paymentNo?: string;
  depositNo?: string;
  refundNo?: string;
  records: StatusRecord[];
  vendor: InfoRow[];
  brand: {
    name: string;
    type: string;
    image: string;
    description: string;
  };
  paymentInfo: InfoRow[];
  refundInfo?: InfoRow[];
  depositRefundInfo?: InfoRow[];
  feeRows: FeeRow[];
  refundRows?: FeeRow[];
  equipmentRows: EquipmentRow[];
  rentalRows: EquipmentRow[];
  electricityRows: ElectricityRow[];
  extraElectricityRows: ElectricityRow[];
  feeTotal: string;
  refundTotal?: string;
  rentalTotal: string;
  electricityTotal: string;
  actions?: DetailAction[];
}

@Component({
  selector: 'app-organizer-dashboard-collection-detail',
  imports: [RouterLink],
  templateUrl: './organizer-dashboard-collection-detail.html',
  styleUrl: './organizer-dashboard-collection-detail.scss',
})
export class OrganizerDashboardCollectionDetail implements OnInit {
  returnPage = 1;
  returnStatus = '';
  detail!: CollectionDetail;

  readonly details: CollectionDetail[] = [
    this.createDetail(1, {
      registrationStatus: ApplicationStatus.pendingSelection,
      paymentStatus: PaymentStatus.paid,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
      ],
    }),
    this.createDetail(2, {
      registrationStatus: PaymentStatus.refundRequested,
      paymentStatus: PaymentStatus.refundRequested,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
        { label: '退款申請時間', value: '2026/06/04 09:25' },
      ],
      refundInfo: [
        { label: '退款方式', value: '原付款方式退回' },
        { label: '金流平台', value: '藍新金流' },
        { label: '退款交易編號', value: '尚未產生' },
      ],
      hasRefundRows: true,
      actions: [
        { key: 'reject-refund', label: '拒絕退款', variant: 'outline' },
        { key: 'approve-refund', label: '同意退款', variant: 'primary' },
      ],
    }),
    this.createDetail(3, {
      registrationStatus: PaymentStatus.refunding,
      paymentStatus: PaymentStatus.refunding,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
        { label: '退款申請時間', value: '2026/06/04 09:25' },
        { label: '退款確認時間', value: '2026/06/04 11:25' },
      ],
      refundInfo: [
        { label: '退款方式', value: '原付款方式退回' },
        { label: '金流平台', value: '藍新金流' },
        { label: '退款交易編號', value: '尚未產生' },
      ],
      hasRefundRows: true,
    }),
    this.createDetail(4, {
      registrationStatus: ApplicationStatus.pendingPayment,
      paymentStatus: PaymentStatus.pending,
      paymentNo: '',
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
      ],
      paymentInfo: [
        { label: '付款方式', value: '信用卡' },
        { label: '金流平台', value: '藍新金流' },
        { label: '付款交易編號', value: '尚未產生' },
      ],
    }),
    this.createDetail(5, {
      registrationStatus: ApplicationStatus.pendingPayment,
      paymentStatus: PaymentStatus.failed,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款失敗時間', value: '2026/06/03 10:18', highlight: true },
      ],
      paymentInfo: [
        { label: '付款方式', value: '信用卡' },
        { label: '金流平台', value: '藍新金流' },
        { label: '付款交易編號', value: 'MP20260603123456' },
        { label: '失敗原因', value: '信用卡授權失敗', accent: true },
      ],
    }),
    this.createDetail(6, {
      registrationStatus: ApplicationStatus.cancelled,
      paymentStatus: PaymentStatus.expired,
      paymentNo: '',
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款逾期時間', value: '2026/06/05 23:59' },
      ],
    }),
    this.createDetail(7, {
      registrationStatus: PaymentStatus.refunding,
      paymentStatus: PaymentStatus.refundFailed,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
        { label: '退款申請時間', value: '2026/06/04 09:25' },
        { label: '退款確認時間', value: '2026/06/04 11:25' },
        { label: '退款失敗時間', value: '2026/06/05 16:40', highlight: true },
      ],
      refundInfo: [
        { label: '退款方式', value: '原付款方式退回' },
        { label: '金流平台', value: '藍新金流' },
        { label: '退款交易編號', value: '尚未產生' },
      ],
      hasRefundRows: true,
    }),
    this.createDetail(8, {
      registrationStatus: PaymentStatus.refunded,
      paymentStatus: PaymentStatus.refunded,
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
        { label: '退款申請時間', value: '2026/06/04 09:25' },
        { label: '退款確認時間', value: '2026/06/04 11:25' },
        { label: '退款時間', value: '2026/06/05 16:40' },
      ],
      refundInfo: [
        { label: '退款方式', value: '原付款方式退回' },
        { label: '金流平台', value: '藍新金流' },
        { label: '退款交易編號', value: 'RF20260605164022' },
      ],
      hasRefundRows: true,
    }),
    this.createDetail(9, {
      registrationStatus: ApplicationStatus.depositReturned,
      paymentStatus: PaymentStatus.paid,
      depositStatus: DepositStatus.refunded,
      depositNo: 'DEP202606030001',
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
        { label: '退位完成時間', value: '2026/06/03 11:20' },
        { label: '最終確認時間', value: '2026/06/03 11:30' },
        { label: '保證金退還時間', value: '2026/06/03 18:30' },
      ],
      depositRefundInfo: [
        { label: '退還方式', value: '現場退還' },
        { label: '退還金額', value: '$1,000' },
      ],
    }),
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: AlertService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id') ?? 1);
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('returnPage'));
    this.returnPage = Number.isInteger(pageFromUrl) && pageFromUrl > 0 ? pageFromUrl : 1;
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';
    this.detail = this.details.find((item) => item.id === id) ?? this.details[0];
  }

  get registrationStatusClass(): string {
    return this.getStatusClass(this.detail.registrationStatus);
  }

  get paymentStatusClass(): string {
    return PaymentStatus.getClass(this.detail.paymentStatus);
  }

  get depositStatusClass(): string {
    return DepositStatus.getClass(this.detail.depositStatus ?? DepositStatus.pending);
  }

  get paymentSummaryRows(): SummaryRow[] {
    return [
      { label: '付款狀態', value: this.detail.paymentStatus, type: 'status' },
      { label: '付款金額', value: this.detail.feeTotal, type: 'amount' },
      { label: '付款方式', value: this.getInfoValue(this.detail.paymentInfo, '付款方式') },
      { label: '付款編號', value: this.detail.paymentNo || this.getInfoValue(this.detail.paymentInfo, '付款交易編號') },
      { label: '金流平台', value: this.getInfoValue(this.detail.paymentInfo, '金流平台') },
    ];
  }

  get registrationSummaryRows(): InfoRow[] {
    return [
      { label: '報名編號', value: this.detail.registrationNo },
      { label: '報名狀態', value: this.detail.registrationStatus, type: 'status', statusClass: this.registrationStatusClass },
      { label: '活動名稱', value: this.detail.activityName },
      { label: '報名日期', value: this.registrationDate },
      { label: '攤主姓名', value: this.getInfoValue(this.detail.vendor, '攤主姓名') },
      { label: '品牌名稱', value: this.detail.brand.name },
    ];
  }

  get registrationDate(): string {
    return this.detail.records[0]?.value ?? '-';
  }

  get activityDateRange(): string {
    const dates = this.detail.activityDate.match(/\d{4}\/\d{2}\/\d{2}/g);
    return dates && dates.length >= 2 ? `${dates[0]} - ${dates[1]}` : this.detail.activityDate;
  }

  private getStatusClass(status: string): string {
    return PaymentStatus.classMap[status] ?? ApplicationStatus.getClass(status);
  }

  viewRegistrationDetail(): void {
    this.router.navigate(['/organizer/dash-board/register/detail', this.detail.id]);
  }

  viewActivityDetail(): void {
    this.router.navigate(['/organizer/dash-board/activity/detail', this.detail.id]);
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/collection'], {
      queryParams: {
        page: this.returnPage,
        status: this.returnStatus || null,
      },
    });
  }

  private getInfoValue(rows: InfoRow[] | undefined, label: string): string {
    return rows?.find((row) => row.label === label)?.value || '-';
  }

  async handleAction(action: DetailAction): Promise<void> {
    if (action.key === 'approve-refund') {
      const confirmed = await this.alert.confirmHtml({
        html: this.getRefundApproveConfirmHtml(),
        confirmButtonText: '確認同意',
        cancelButtonText: '取消',
        popupClass: 'registration-action-swal collection-refund-swal',
      });

      if (!confirmed) {
        return;
      }

      await this.alert.successHtml({
        html: this.getRefundApproveSuccessHtml(),
        confirmButtonText: '我知道了',
        popupClass: 'registration-result-swal collection-refund-swal',
        showCloseButton: true,
      });
      return;
    }

    if (action.key === 'reject-refund') {
      const confirmed = await this.alert.confirmHtml({
        html: this.getRefundRejectConfirmHtml(),
        confirmButtonText: '確認拒絕',
        cancelButtonText: '取消',
        popupClass: 'registration-action-swal collection-refund-swal',
      });

      if (!confirmed) {
        return;
      }

      await this.alert.successHtml({
        html: this.getRefundRejectSuccessHtml(),
        confirmButtonText: '我知道了',
        popupClass: 'registration-result-swal collection-refund-swal',
        showCloseButton: true,
      });
      return;
    }

    await this.handleAction({ ...action, key: 'approve-refund' });
  }

  private getRefundApproveConfirmHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon warning">
          <i class="bi bi-exclamation-lg"></i>
        </div>
        <h3>退款審核通過確認</h3>
        <p class="registration-swal-main">確認同意此筆退款申請嗎？</p>
        <p class="registration-swal-sub">同意後系統將送出退款作業，並將付款狀態更新為退款處理中。</p>
      </div>
    `;
  }

  private getRefundApproveSuccessHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon success">
          <i class="bi bi-check-lg"></i>
        </div>
        <h3>退款申請審核通過</h3>
        <p class="registration-swal-main">此筆退款申請已確認通過。</p>
        <p class="registration-swal-sub">系統將送出退款作業，並進入退款處理中狀態。</p>
      </div>
    `;
  }

  private getRefundRejectConfirmHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon warning">
          <i class="bi bi-exclamation-lg"></i>
        </div>
        <h3>退款審核拒絕確認</h3>
        <p class="registration-swal-main">確認拒絕此筆退款申請嗎？</p>
        <p class="registration-swal-sub">拒絕後系統將通知攤主退款申請未通過，並保留原付款紀錄。</p>
      </div>
    `;
  }

  private getRefundRejectSuccessHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon success">
          <i class="bi bi-check-lg"></i>
        </div>
        <h3>退款申請已拒絕</h3>
        <p class="registration-swal-main">此筆退款申請已完成拒絕。</p>
        <p class="registration-swal-sub">系統將通知攤主審核結果，並保留原付款紀錄。</p>
      </div>
    `;
  }

  private createDetail(
    id: number,
    overrides: Partial<Omit<CollectionDetail, 'refundRows'>> & {
      hasRefundRows?: boolean;
    },
  ): CollectionDetail {
    const refundRows = overrides.hasRefundRows
      ? [
          { item: '報名費', content: '2 天（05/30、05/31）', amount: '$1,300' },
          { item: '設備租借費', content: '桌子（加租）× 1、椅子（加租）× 2', amount: '$300' },
          { item: '額外用電費', content: '110V / 1000W、220V / 2000W', amount: '$1,200' },
          { item: '保證金', content: '保證金不退還', amount: '不退還' },
        ]
      : undefined;

    return {
      id,
      activityName: '夏日綠意市集',
      activityImage: `assets/images/market/cards/market-card-0${Math.min(id, 8)}.png`,
      activityStatus: '進行中',
      activityDate: '2026/05/30（六）14:00 - 2026/05/31（日）20:00',
      activityLocation: '宜蘭轉站前天天園森林廣場',
      activityAddress: '宜蘭縣宜蘭市中山路一段243號',
      registrationStatus: ApplicationStatus.pendingSelection,
      paymentStatus: PaymentStatus.paid,
      registrationNo: 'REG202206010014',
      paymentNo: 'PAY20260603101856',
      records: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 10:18' },
      ],
      vendor: [
        { label: '攤主姓名', value: '林小森' },
        { label: '聯絡電話', value: '0912-345-678' },
        { label: '電子郵件', value: 'linsen@example.com' },
        { label: '聯絡地址', value: '台北市中山區南京東路三段188號' },
      ],
      brand: {
        name: '森林選物',
        type: '文創手作',
        image: `assets/images/user/brand/brands/brand-0${((id - 1) % 8) + 1}/logo.png`,
        description: '我們挑選來自台灣各地的手作品與自然系生活小物，希望將森林的溫度帶進日常生活。',
      },
      paymentInfo: [
        { label: '付款方式', value: '信用卡' },
        { label: '金流平台', value: '藍新金流' },
        { label: '付款交易編號', value: 'MP20260603123456' },
      ],
      feeRows: [
        { item: '報名費', content: '2 天（05/30、05/31）', amount: '$1,300（$650 × 2 天）' },
        { item: '設備租借費', content: '桌子（加租）× 1、椅子（加租）× 2', amount: '$300（$150 × 2 天）' },
        { item: '額外用電費', content: '110V / 1000W、220V / 2000W', amount: '$1,200（$600 × 2 天）' },
        { item: '保證金', content: '活動結束後退還', amount: '$1,000' },
      ],
      equipmentRows: [
        { name: '桌子（基本）', spec: '180 × 60 公分', quantity: '1', unit: '張' },
        { name: '椅子（基本）', spec: '一般塑膠椅', quantity: '2', unit: '張' },
      ],
      rentalRows: [
        { name: '桌子（加租）', spec: '180 × 60 公分', quantity: '1', price: '$100 / 張', subtotal: '$100（2天）' },
        { name: '椅子（加租）', spec: '一般塑膠椅', quantity: '2', price: '$50 / 張', subtotal: '$100（2天）' },
      ],
      electricityRows: [{ spec: '110V / 500W', power: '500W' }],
      extraElectricityRows: [
        { spec: '110V / 1000W', power: '1000W', price: '$200 / 天', subtotal: '$400（2天）' },
        { spec: '220V / 2000W', power: '2000W', price: '$400 / 天', subtotal: '$800（2天）' },
      ],
      feeTotal: '$3,800',
      refundRows,
      refundTotal: refundRows ? '$2,800' : undefined,
      rentalTotal: '$200（2天）',
      electricityTotal: '$1,200（2天）',
      ...overrides,
    };
  }
}
