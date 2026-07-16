import {
  ApplicationRef,
  Component,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  OrganizerRegistrationDetail,
  OrganizerRegistrationDetailAction,
  OrganizerRegistrationDetailSeed,
  OrganizerRegistrationRejectReasonForm,
  OrganizerRegistrationStatusRecordItem,
} from '../../../../models/interface/organizer/OrganizerRegistrationDetail';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import { AlertService } from '../../../../core/services/alert.service';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { MarketMap } from '../../../shared/market-map/market-map';

const registrationRows: OrganizerRegistrationDetailSeed[] = [
  {
    id: 1,
    activity: '夏日綠意市集',
    activityImage: 'assets/images/market/cards/market-card-01.png',
    activityTime: '2026/06/15 - 2026/06/21',
    brandName: '森林選物',
    vendorName: '林小森',
    brandType: '文創手作',
    registeredAt: '2026/06/01 14:30',
    status: ApplicationStatus.pendingReview,
  },
  {
    id: 2,
    activity: '職人咖啡生活市集',
    activityImage: 'assets/images/market/cards/market-card-02.png',
    activityTime: '2026/06/27 - 2026/06/28',
    brandName: '毛孩日常',
    vendorName: '陳小米',
    brandType: '寵物生活',
    registeredAt: '2026/06/01 10:15',
    status: ApplicationStatus.reviewRejected,
  },
  {
    id: 3,
    activity: '衣著選物週末',
    activityImage: 'assets/images/market/cards/market-card-03.png',
    activityTime: '2026/07/04 - 2026/07/05',
    brandName: '慢日子',
    vendorName: '黃慢慢',
    brandType: '文創手作',
    registeredAt: '2026/05/31 16:45',
    status: ApplicationStatus.pendingPayment,
  },
  {
    id: 4,
    activity: '風格選物生活節',
    activityImage: 'assets/images/market/cards/market-card-04.png',
    activityTime: '2026/07/18 - 2026/07/19',
    brandName: '植感生活',
    vendorName: '周植植',
    brandType: '植物選物',
    registeredAt: '2026/05/30 09:20',
    status: ApplicationStatus.pendingSelection,
  },
  {
    id: 5,
    activity: '毛孩友善市集',
    activityImage: 'assets/images/market/cards/market-card-05.png',
    activityTime: '2026/08/01 - 2026/08/02',
    brandName: '小日子手作',
    vendorName: '張小日',
    brandType: '文創手作',
    registeredAt: '2026/05/29 13:50',
    status: ApplicationStatus.refundPending,
  },
  {
    id: 6,
    activity: '植感生活市集',
    activityImage: 'assets/images/market/cards/market-card-06.png',
    activityTime: '2026/08/15 - 2026/08/16',
    brandName: '山系日常',
    vendorName: '吳小山',
    brandType: '文創手作',
    registeredAt: '2026/05/28 11:20',
    status: ApplicationStatus.completed,
  },
  {
    id: 7,
    activity: '秋日風格市集',
    activityImage: 'assets/images/market/cards/market-card-07.png',
    activityTime: '2026/09/05 - 2026/09/06',
    brandName: '秋光選物',
    vendorName: '林秋光',
    brandType: '生活選物',
    registeredAt: '2026/05/27 15:10',
    status: ApplicationStatus.refunding,
  },
  {
    id: 8,
    activity: '冬日暖心市集',
    activityImage: 'assets/images/market/cards/market-card-08.png',
    activityTime: '2026/09/19 - 2026/09/20',
    brandName: '拾甜製菓',
    vendorName: '簡小單',
    brandType: '餐飲美食',
    registeredAt: '2026/05/25 18:30',
    status: ApplicationStatus.refunded,
  },
  {
    id: 9,
    activity: '月光手作夜市集',
    activityImage: 'assets/images/market/cards/market-card-09.png',
    activityTime: '2026/10/03 - 2026/10/04',
    brandName: '月光織所',
    vendorName: '沈月月',
    brandType: '文創手作',
    registeredAt: '2026/05/24 12:10',
    status: ApplicationStatus.cancelled,
  },
  {
    id: 10,
    activity: '海風手作市集',
    activityImage: 'assets/images/market/cards/market-card-10.png',
    activityTime: '2026/11/14 - 2026/11/15',
    brandName: '海鹽工房',
    vendorName: '許海鹽',
    brandType: '文創手作',
    registeredAt: '2026/05/22 09:40',
    status: ApplicationStatus.pendingReview,
  },
  {
    id: 11,
    activity: '春日散策市集',
    activityImage: 'assets/images/market/cards/market-card-11.png',
    activityTime: '2026/04/11 - 2026/04/12',
    brandName: '花間織所',
    vendorName: '蔡花見',
    brandType: '生活選物',
    registeredAt: '2026/04/01 09:30',
    status: ApplicationStatus.depositReturned,
  },
];

interface DetailSummaryRow {
  label: string;
  value: string;
  type?: 'status' | 'amount';
}

@Component({
  selector: 'app-organizer-dashboard-registration-detail',
  imports: [RouterLink, MarketMap],
  templateUrl: './organizer-dashboard-registration-detail.html',
  styleUrl: './organizer-dashboard-registration-detail.scss',
})
export class OrganizerDashboardRegistrationDetail implements OnInit {
  @ViewChild('boothMapModal') private boothMapModal?: MarketMap;

  readonly ApplicationStatus = ApplicationStatus;
  readonly rejectReasonOptions = [
    '品牌資料填寫不完整',
    '申請資料填寫不完整',
    '品牌類型不符合該市集',
    '商品內容不符合規範',
    '其他原因',
  ];

  returnPage = 1;
  returnStatus = '';
  detail: OrganizerRegistrationDetail = this.createDetail(registrationRows[0], registrationRows[0].status);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly appRef: ApplicationRef,
    private readonly environmentInjector: EnvironmentInjector,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const status = this.route.snapshot.queryParamMap.get('status');
    const returnPage = Number(this.route.snapshot.queryParamMap.get('returnPage'));
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';

    if (Number.isInteger(returnPage) && returnPage > 0) {
      this.returnPage = returnPage;
    }

    this.detail = this.getDetail(id, status);
  }

  get statusClass(): string {
    return ApplicationStatus.getClass(this.detail.status);
  }

  get registrationPeriods(): string[] {
    return this.detail.registration.period
      .split(/[\r\n、]+/)
      .map((period) => period.replaceAll('、', '').trim())
      .filter(Boolean);
  }

  get equipmentSummaryRows(): DetailSummaryRow[] {
    return [
      { label: '基本設備', value: this.summarizeEquipment(this.detail.freeEquipmentRows) },
      { label: '租借設備', value: this.summarizeEquipment(this.detail.rentalEquipmentRows) },
      { label: '基本用電', value: this.summarizePower(this.detail.basicPowerRows) },
      { label: '額外用電', value: this.summarizePower(this.detail.extraPowerRows) },
    ];
  }

  get paymentSummaryRows(): DetailSummaryRow[] {
    const rows: DetailSummaryRow[] = [
      { label: '付款狀態', value: this.detail.payment.status, type: 'status' },
      { label: '付款金額', value: this.detail.payment.amount, type: 'amount' },
      { label: '付款方式', value: this.detail.payment.method },
      { label: '付款編號', value: this.detail.payment.transactionNo },
    ];

    return rows;
  }

  get pageActions(): OrganizerRegistrationDetailAction[] {
    switch (this.detail.status) {
      case ApplicationStatus.pendingReview:
        return [
          { key: 'reject', label: '審核未通過', icon: 'bi-x-lg', variant: 'outline' },
          { key: 'approve', label: '審核通過', icon: 'bi-check-lg', variant: 'primary' },
        ];
      case ApplicationStatus.completed:
        const canReturnDeposit = this.isActivityEnded(this.detail.activity.date);
        return [
          {
            key: 'returnDeposit',
            label: '退還保證金',
            variant: 'primary',
            disabled: !canReturnDeposit,
            hint: canReturnDeposit ? undefined : '活動結束後即可退還保證金',
          },
        ];
      case ApplicationStatus.pendingSelection:
        return [
          { key: 'chooseBooth', label: '選擇攤位', icon: 'bi-grid-3x3-gap', variant: 'primary' },
        ];
      case ApplicationStatus.refundPending:
        return [
          { key: 'goPaymentManagement', label: '前往確認退款', icon: 'bi-cash-coin', variant: 'primary' },
        ];
      case ApplicationStatus.refunding:
      case ApplicationStatus.refunded:
        return [
          { key: 'viewRefundInfo', label: '查看退款資訊', icon: 'bi-eye', variant: 'primary' },
        ];
      case ApplicationStatus.depositReturned:
        return [
          { key: 'viewDepositInfo', label: '查看保證金資訊', icon: 'bi-eye', variant: 'primary' },
        ];
      default:
        return [];
    }
  }

  get statusRecords(): OrganizerRegistrationStatusRecordItem[] {
    const times = this.detail.times;

    switch (this.detail.status) {
      case ApplicationStatus.reviewRejected:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
        ]);
      case ApplicationStatus.cancelled:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款期限', value: this.detail.payment.deadline },
          { label: '已取消時間', value: times.cancelledAt },
        ]);
      case ApplicationStatus.pendingReview:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
        ]);
      case ApplicationStatus.pendingPayment:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款期限', value: this.detail.payment.deadline },
        ]);
      case ApplicationStatus.pendingSelection:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
        ]);
      case ApplicationStatus.refundPending:
      case ApplicationStatus.refunding:
      case ApplicationStatus.refunded:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '退款申請時間', value: times.refundRequestedAt },
          { label: '退款審核時間', value: times.refundReviewedAt },
          { label: '退款完成時間', value: times.refundedAt },
        ]);
      case ApplicationStatus.completed:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '攤位完成時間', value: times.selectedAt },
        ]);
      case ApplicationStatus.depositReturned:
        return this.presentStatusRecords([
          { label: '報名時間', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '攤位時間', value: times.selectedAt },
          { label: '最終確認時間', value: times.finalConfirmedAt },
          { label: '保證金退還時間', value: times.depositReturnedAt },
        ]);
      default:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '攤位完成時間', value: times.selectedAt },
          { label: '最終確認時間', value: times.finalConfirmedAt },
          { label: '保證金退還', value: times.depositReturnedAt },
        ]);
    }
  }

  async handlePageAction(action: OrganizerRegistrationDetailAction): Promise<void> {
    if (action.disabled) {
      return;
    }

    switch (action.key) {
      case 'approve':
        await this.approveRegistration();
        return;
      case 'reject':
        await this.rejectRegistration();
        return;
      case 'returnDeposit':
        await this.returnDeposit();
        return;
      case 'goPaymentManagement':
        this.router.navigate(['/organizer/dash-board/collection/detail', this.getCollectionDetailId(this.detail.status)]);
        return;
      case 'chooseBooth':
        await this.alert.info('選擇攤位', '將前往攤位分配功能。', '知道了');
        return;
      case 'viewRefundInfo':
        this.router.navigate(['/organizer/dash-board/collection/detail', this.getCollectionDetailId(this.detail.status)]);
        return;
      case 'viewDepositInfo':
        this.router.navigate(['/organizer/dash-board/collection/detail', this.getCollectionDetailId(this.detail.status)]);
        return;
      case 'viewActivity':
        this.router.navigate(['/organizer/dash-board/activity/detail', this.detail.id]);
        return;
      case 'viewBrand':
        this.openInNewTab('/user/brand-detail');
        return;
      case 'viewBoothMap':
        this.boothMapModal?.openFullscreenMap();
        return;
    }
  }

  private openInNewTab(path: string): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([path]));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private getCollectionDetailId(status: string): number {
    switch (status) {
      case ApplicationStatus.refundPending:
        return 2;
      case ApplicationStatus.refunding:
        return 3;
      case ApplicationStatus.refunded:
        return 8;
      case ApplicationStatus.depositReturned:
        return 9;
      case ApplicationStatus.cancelled:
        return 6;
      default:
        return 1;
    }
  }

  private summarizeEquipment(rows: OrganizerRegistrationDetail['freeEquipmentRows']): string {
    if (!rows.length) {
      return '-';
    }

    return rows
      .map((row) => {
        const name = row.cells[0].replace(/（.*?）/g, '');
        const quantity = row.cells[2];

        if (row.cells[4]) {
          return `${name} × ${quantity}　${row.cells[3]}`;
        }

        return `${name} × ${quantity}${row.cells[3] ?? ''}`;
      })
      .join('、');
  }

  private summarizePower(rows: OrganizerRegistrationDetail['basicPowerRows']): string {
    if (!rows.length) {
      return '-';
    }

    return rows.map((row) => row.cells[0]).join('、');
  }

  private isActivityEnded(activityTime: string): boolean {
    const [, endText] = activityTime.split(' - ');

    if (!endText) {
      return false;
    }

    const [year, month, day] = endText.split('/').map(Number);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    return new Date() > endDate;
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/register'], {
      queryParams: {
        page: this.returnPage,
        status: this.returnStatus || null,
      },
    });
  }

  private presentStatusRecords(
    records: Array<{ label: string; value?: string }>,
  ): OrganizerRegistrationStatusRecordItem[] {
    return records.filter((record): record is OrganizerRegistrationStatusRecordItem => Boolean(record.value));
  }

  private async approveRegistration(): Promise<void> {
    const confirmed = await this.alert.confirmHtml({
      html: this.getApproveConfirmHtml(),
      confirmButtonText: '確認通過',
      cancelButtonText: '取消',
      popupClass: 'registration-action-swal',
    });

    if (!confirmed) {
      return;
    }

    this.detail = this.applyStatus({
      ...this.detail,
      status: ApplicationStatus.pendingPayment,
    });

    await this.alert.successHtml({
      html: this.getApproveSuccessHtml(),
      confirmButtonText: '知道了',
      popupClass: 'registration-result-swal',
      showCloseButton: true,
    });
  }

  private async rejectRegistration(): Promise<void> {
    const form = await this.openRejectReasonForm();

    if (!form) {
      return;
    }

    const confirmed = await this.alert.confirmHtml({
      html: this.getRejectConfirmHtml(form),
      confirmButtonText: '確認送出',
      cancelButtonText: '取消',
      popupClass: 'registration-action-swal registration-reject-confirm-swal',
    });

    if (!confirmed) {
      return;
    }

    this.detail = {
      ...this.detail,
      status: ApplicationStatus.reviewRejected,
      times: {
        ...this.detail.times,
        reviewedAt: this.formatNow(),
      },
      reason: {
        title: '審核未通過原因',
        subtitle: form.reason,
        description: form.description || this.getRejectDefaultDescription(form.reason),
      },
    };

    await this.alert.successHtml({
      html: this.getRejectSuccessHtml(form),
      confirmButtonText: '知道了',
      popupClass: 'registration-result-swal registration-reject-result-swal',
      showCloseButton: true,
    });
  }

  private async returnDeposit(): Promise<void> {
    const confirmed = await this.alert.confirmHtml({
      html: this.getDepositReturnConfirmHtml(),
      confirmButtonText: '確認退還',
      cancelButtonText: '取消',
      popupClass: 'registration-action-swal registration-deposit-swal',
    });

    if (!confirmed) {
      return;
    }

    this.detail = this.applyStatus({
      ...this.detail,
      status: ApplicationStatus.depositReturned,
      times: {
        ...this.detail.times,
        depositReturnedAt: this.formatNow(),
      },
    });

    await this.alert.successHtml({
      html: this.getDepositReturnSuccessHtml(),
      confirmButtonText: '知道了',
      popupClass: 'registration-result-swal',
      showCloseButton: true,
    });
  }

  private async openRejectReasonForm(): Promise<OrganizerRegistrationRejectReasonForm | null> {
    let selectedReason = '';
    let dropdownRef: ComponentRef<Dropdown> | null = null;

    const result = await this.alert.custom<OrganizerRegistrationRejectReasonForm>({
      html: this.getRejectReasonFormHtml(),
      showCancelButton: true,
      confirmButtonText: '送出結果',
      cancelButtonText: '取消',
      reverseButtons: true,
      allowOutsideClick: true,
      customClass: {
        popup: 'registration-action-swal registration-reject-form-swal require-supplement-swal',
      },
      didOpen: () => {
        const host = document.getElementById('rejectReasonDropdownHost');

        if (!host) {
          return;
        }

        dropdownRef = createComponent(Dropdown, {
          environmentInjector: this.environmentInjector,
        });
        dropdownRef.instance.placeholder = '請選擇未通過原因';
        dropdownRef.instance.options = this.rejectReasonOptions;
        dropdownRef.instance.optionSelected.subscribe((value) => {
          selectedReason = value;
          dropdownRef!.instance.invalid = false;
          dropdownRef!.changeDetectorRef.detectChanges();
          const error = document.querySelector<HTMLElement>('.registration-swal-field-error');
          if (error) {
            error.textContent = '';
          }
        });
        this.appRef.attachView(dropdownRef.hostView);
        host.appendChild(dropdownRef.location.nativeElement);

        const descriptionInput = document.getElementById('rejectDescription') as HTMLTextAreaElement | null;
        const descriptionCounter = document.getElementById('rejectDescriptionCount');
        descriptionInput?.addEventListener('input', () => {
          if (descriptionCounter) {
            descriptionCounter.textContent = `${descriptionInput.value.length}/300`;
          }
          descriptionInput.classList.remove('is-invalid');
          const error = document.querySelector<HTMLElement>('.registration-swal-field-error');
          if (error) {
            error.textContent = '';
          }
        });
      },
      willClose: () => {
        if (dropdownRef) {
          this.appRef.detachView(dropdownRef.hostView);
          dropdownRef.destroy();
          dropdownRef = null;
        }
      },
      preConfirm: () => {
        const descriptionInput = document.getElementById('rejectDescription') as HTMLTextAreaElement | null;
        const description = descriptionInput?.value.trim() ?? '';
        const error = document.querySelector<HTMLElement>('.registration-swal-field-error');

        if (!selectedReason) {
          if (dropdownRef) {
            dropdownRef.instance.invalid = true;
            dropdownRef.changeDetectorRef.detectChanges();
          }

          if (error) {
            error.textContent = '請選擇未通過原因';
          }

          return false;
        }

        if (!description) {
          descriptionInput?.classList.add('is-invalid');
          descriptionInput?.focus();
          if (error) {
            error.textContent = '請填寫原因說明';
          }

          return false;
        }

        if (error) {
          error.textContent = '';
        }

        descriptionInput?.classList.remove('is-invalid');

        if (dropdownRef) {
          dropdownRef.instance.invalid = false;
          dropdownRef.changeDetectorRef.detectChanges();
        }

        return {
          reason: selectedReason,
          description,
        };
      },
    });

    return result.isConfirmed && result.value ? result.value : null;
  }

  private getApproveConfirmHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon warning">
          <i class="bi bi-exclamation-lg"></i>
        </div>
        <h3>確認審核通過</h3>
        <p class="registration-swal-main">確認通過此筆報名申請嗎？</p>
        <p class="registration-swal-sub">通過後系統將通知攤主進行付款。</p>
      </div>
    `;
  }

  private getApproveSuccessHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon success">
          <i class="bi bi-check-lg"></i>
        </div>
        <h3>送出審核成功</h3>
        <p class="registration-swal-main">此筆報名已成功通過審核。</p>
        <p class="registration-swal-sub">系統已通知攤主，請等待攤主完成付款。</p>
      </div>
    `;
  }

  private getRejectReasonFormHtml(): string {
    return `
      <div class="registration-swal-content registration-reject-form">
        <div class="registration-swal-icon warning document">
          <i class="bi bi-file-earmark-text"></i>
        </div>
        <h3>填寫未通過原因</h3>
        <p class="registration-swal-sub">請選擇未通過原因，送出後系統將通知攤主審核結果。</p>

        <label class="registration-swal-field">
          <span>未通過原因 <b>*</b></span>
          <div id="rejectReasonDropdownHost" class="registration-swal-dropdown-host"></div>
        </label>

        <label class="registration-swal-field required-reason-field">
          <span>原因說明 <b>*</b></span>
          <span class="required-reason-control">
            <textarea id="rejectDescription" class="supplement-swal-textarea" maxlength="300" placeholder="請輸入原因說明"></textarea>
            <em class="supplement-swal-counter" id="rejectDescriptionCount">0/300</em>
          </span>
        </label>

        <p class="registration-swal-field-error" aria-live="polite"></p>
      </div>
    `;
  }

  private getRejectConfirmHtml(form: OrganizerRegistrationRejectReasonForm): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon warning">
          <i class="bi bi-exclamation-lg"></i>
        </div>
        <h3>確認審核未通過</h3>
        <p class="registration-swal-main">確定要將此筆報名設為未通過嗎？</p>
        <p class="registration-swal-sub">送出後系統將通知攤主審核結果。</p>

        <div class="registration-swal-summary">
          <div>
            <span>未通過原因</span>
            <strong>${form.reason}</strong>
          </div>
          <div>
            <span>原因說明</span>
            <strong>${form.description || this.getRejectDefaultDescription(form.reason)}</strong>
          </div>
        </div>
      </div>
    `;
  }

  private getRejectSuccessHtml(form: OrganizerRegistrationRejectReasonForm): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon error">
          <i class="bi bi-x-lg"></i>
        </div>
        <h3>審核未通過</h3>
        <p class="registration-swal-main">此筆報名未通過審核。</p>
        <p class="registration-swal-sub">系統已通知攤主審核結果。</p>

        <div class="registration-swal-summary">
          <div>
            <span>未通過原因</span>
            <strong>${form.reason}</strong>
          </div>
          <div>
            <span>原因說明</span>
            <strong>${form.description || this.getRejectDefaultDescription(form.reason)}</strong>
          </div>
        </div>
      </div>
    `;
  }

  private getDepositReturnConfirmHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon warning">
          <i class="bi bi-exclamation-lg"></i>
        </div>
        <h3>保證金退還確認</h3>
        <p class="registration-swal-main">請確認攤主已完成活動參與，且符合保證金退還條件。</p>
        <p class="registration-swal-sub">確認後系統將記錄本次保證金退還時間，此操作無法復原。</p>

        <div class="registration-swal-summary deposit">
          <div>
            <span>保證金金額</span>
            <strong class="amount">$1,000</strong>
          </div>
          <div>
            <span>退還方式</span>
            <strong>現場退還</strong>
          </div>
        </div>
      </div>
    `;
  }

  private getDepositReturnSuccessHtml(): string {
    return `
      <div class="registration-swal-content">
        <div class="registration-swal-icon success">
          <i class="bi bi-check-lg"></i>
        </div>
        <h3>保證金已退還</h3>
        <p class="registration-swal-main">此筆報名已記錄保證金退還。</p>
        <p class="registration-swal-sub">狀態已更新為保證金已退還。</p>
      </div>
    `;
  }

  private getRejectDefaultDescription(reason: string): string {
    const descriptionMap: Record<string, string> = {
      品牌資料填寫不完整: '請補充品牌介紹與商品照片後重新提交報名。',
      申請資料填寫不完整: '請補齊聯絡資料、攤位需求或報名內容後重新提交報名。',
      品牌類型不符合該市集: '您申請的品牌類型與本活動開放類別不符，請重新選擇符合的品牌類型後再提交報名。',
      商品內容不符合規範: '商品內容與活動規範不符，請調整商品內容後再提交報名。',
      其他原因: '請依主辦方補充說明調整資料後，再重新提交報名。',
    };

    return descriptionMap[reason] ?? '請依主辦方補充說明調整資料後，再重新提交報名。';
  }

  private formatNow(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${date} ${hour}:${minute}`;
  }

  private getDetail(id: number, statusFromQuery: string | null): OrganizerRegistrationDetail {
    const row = registrationRows.find((item) => item.id === id) ?? registrationRows[0];
    const status = statusFromQuery && ApplicationStatus.list.includes(statusFromQuery)
      ? statusFromQuery
      : row.status;

    return this.createDetail(row, status);
  }

  private createDetail(row: OrganizerRegistrationDetailSeed, status: string): OrganizerRegistrationDetail {
    const detail: OrganizerRegistrationDetail = {
      id: row.id,
      status,
      registrationNo: `REG2022060100${String(row.id).padStart(2, '0')}`,
      activity: {
        name: row.activity,
        image: row.activityImage,
        date: this.getActivityDateTime(row.activityTime),
        status: '進行中',
        location: this.getActivityLocation(row.id),
        address: this.getActivityAddress(row.id),
      },
      vendor: {
        name: row.vendorName,
        phone: this.getVendorPhone(row.id),
        email: this.getVendorEmail(row.id),
        address: this.getVendorAddress(row.id),
      },
      brand: {
        name: row.brandName,
        type: row.brandType,
        image: this.getBrandLogo(row.id),
        description: this.getBrandDescription(row.brandName),
      },
      registration: {
        period: this.getRegistrationPeriod(row.activityTime),
        boothSpec: '長 2 公尺 × 寬 3 公尺',
        boothZone: 'A 區',
        boothCategories: this.getBoothCategories(row.brandType),
        vehiclePlate: 'ABC-1234',
        note: '-',
        rentalEquipment: '桌子（加租）× 1、椅子（加租）× 2',
      },
      fee: {
        boothFee: '$1,300',
        electricityFee: '$1,200',
        deposit: '$1,000',
        total: '$3,800',
      },
      payment: {
        status: '待付款',
        method: '-',
        transactionNo: '-',
        amount: '$3,800',
        deadline: '2026/06/05 23:59',
      },
      boothAssignments: [],
      feeRows: [
        { label: '報名費', content: '2 天（05/30 + 05/31）', value: '$1,300（$650 × 2 天）' },
        { label: '設備租借費', content: '桌子（加租）× 1、椅子（加租）× 2', value: '$300（$150 × 2 天）' },
        { label: '額外用電費', content: '110V / 1000W、220V / 2000W', value: '$1,200（$600 × 2 天）' },
        { label: '保證金', content: '活動結束後退還', value: '$1,000' },
      ],
      freeEquipmentRows: [
        { cells: ['桌子（基本）', '180 × 60 公分', '1', '張'] },
        { cells: ['椅子（基本）', '一般塑膠椅', '2', '張'] },
      ],
      rentalEquipmentRows: [
        { cells: ['桌子（加租）', '180 × 60 公分', '1', '$100 / 張', '$100（2天）'] },
        { cells: ['椅子（加租）', '一般塑膠椅', '2', '$50 / 張', '$100（2天）'] },
      ],
      basicPowerRows: [
        { cells: ['110V / 500W', '500W'] },
      ],
      extraPowerRows: [
        { cells: ['110V / 1000W', '1000W', '$200 / 天', '$400（2天）'] },
        { cells: ['220V / 2000W', '2000W', '$400 / 天', '$800（2天）'] },
      ],
      rentalEquipmentSubtotal: '$200（2天）',
      extraPowerSubtotal: '$1,200（2天）',
      times: {
        registeredAt: row.registeredAt,
      },
    };

    return this.applyStatus(detail);
  }

  private applyStatus(detail: OrganizerRegistrationDetail): OrganizerRegistrationDetail {
    const times = { ...detail.times };
    let reason = detail.reason;
    let refund = detail.refund;
    let depositReturn = detail.depositReturn;
    let payment = { ...detail.payment };
    let boothAssignments = [...detail.boothAssignments];
    let fee = { ...detail.fee };
    let feeRows = [...detail.feeRows];

    switch (detail.status) {
      case ApplicationStatus.pendingReview:
        break;
      case ApplicationStatus.reviewRejected:
        times.reviewedAt ??= '2026/06/02 15:30';
        reason ??= {
          title: '審核未通過原因',
          subtitle: '攤位類別不符合',
          description: '您申請的攤位類別與本活動開放類別不符，請重新選擇符合的攤位類別後再提交報名。',
        };
        break;
      case ApplicationStatus.pendingPayment:
        times.reviewedAt ??= '2026/06/02 15:30';
        payment = {
          ...payment,
          status: '待付款',
          method: '-',
          transactionNo: '-',
        };
        break;
      case ApplicationStatus.pendingSelection:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.paidAt ??= '2026/06/03 16:50';
        payment = this.paidPayment(payment);
        boothAssignments = this.unselectedBooths();
        break;
      case ApplicationStatus.completed:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.paidAt ??= '2026/06/03 16:50';
        times.selectedAt ??= '2026/06/05 14:33';
        times.finalConfirmedAt ??= '2026/06/07 10:30';
        payment = this.paidPayment(payment);
        boothAssignments = this.selectedBooths();
        break;
      case ApplicationStatus.depositReturned:
        times.reviewedAt ??= '2026/04/02 10:00';
        times.paidAt ??= '2026/04/03 11:20';
        times.selectedAt ??= '2026/04/05 13:10';
        times.finalConfirmedAt ??= '2026/04/08 16:00';
        times.depositReturnedAt ??= '2026/04/13 10:20';
        payment = this.paidPayment(payment);
        boothAssignments = this.selectedBooths('已完成選位');
        depositReturn = {
          amount: '$1,000',
          method: '現場退還',
          returnedAt: times.depositReturnedAt,
        };
        fee = {
          ...fee,
          deposit: '已退還 $1,000',
        };
        feeRows = feeRows.map((row) => row.label === '保證金'
          ? { ...row, content: '已退還', value: '$1,000' }
          : row);
        break;
      case ApplicationStatus.refundPending:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.paidAt ??= '2026/06/03 11:20';
        times.refundRequestedAt ??= '2026/06/10 15:22';
        payment = { ...this.paidPayment(payment), status: '退款申請中' };
        boothAssignments = this.selectedBooths();
        refund = this.refundInfo(times, '退款申請中');
        break;
      case ApplicationStatus.refunding:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.paidAt ??= '2026/06/03 11:20';
        times.refundRequestedAt ??= '2026/06/10 15:22';
        times.refundReviewedAt ??= '2026/06/11 18:22';
        payment = { ...this.paidPayment(payment), status: '退款處理中' };
        boothAssignments = this.selectedBooths();
        refund = this.refundInfo(times, '退款處理中');
        break;
      case ApplicationStatus.refunded:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.paidAt ??= '2026/06/03 11:20';
        times.refundRequestedAt ??= '2026/06/10 15:22';
        times.refundReviewedAt ??= '2026/06/11 18:22';
        times.refundedAt ??= '2026/06/13 09:56';
        payment = { ...this.paidPayment(payment), status: '已退款' };
        boothAssignments = this.selectedBooths();
        refund = this.refundInfo(times, '已退款');
        break;
      case ApplicationStatus.cancelled:
        times.reviewedAt ??= '2026/06/02 15:30';
        times.cancelledAt ??= '2026/06/08 10:00';
        payment = {
          ...payment,
          status: '已取消',
          method: '-',
          transactionNo: '-',
        };
        boothAssignments = this.unselectedBooths();
        reason ??= {
          title: '取消原因',
          subtitle: '付款逾期失效',
          description: '付款期限內未完成付款，系統已自動取消本次報名，如需參與活動，請重新提出報名申請。',
        };
        break;
    }

    return {
      ...detail,
      fee,
      payment,
      boothAssignments,
      feeRows,
      refund,
      depositReturn,
      times,
      reason,
    };
  }

  private paidPayment(payment: OrganizerRegistrationDetail['payment']): OrganizerRegistrationDetail['payment'] {
    return {
      ...payment,
      status: '已付款',
      method: '信用卡',
      transactionNo: 'T202406030000123',
    };
  }

  private selectedBooths(status = '已選位'): OrganizerRegistrationDetail['boothAssignments'] {
    return [
      { date: '2026/05/30', boothNo: 'A-023', zone: 'A 區', status },
      { date: '2026/05/31', boothNo: 'A-023', zone: 'A 區', status },
    ];
  }

  private unselectedBooths(): OrganizerRegistrationDetail['boothAssignments'] {
    return [
      { date: '2026/05/30', boothNo: '-', zone: '-', status: '尚未選位' },
      { date: '2026/05/31', boothNo: '-', zone: '-', status: '尚未選位' },
    ];
  }

  private refundInfo(
    times: OrganizerRegistrationDetail['times'],
    status: string,
  ): NonNullable<OrganizerRegistrationDetail['refund']> {
    return {
      reason: '因個人行程異動',
      description: '無法參與本次活動，申請取消報名並辦理退款。',
      requestedAt: times.refundRequestedAt,
      confirmedAt: times.refundReviewedAt,
      refundedAt: status === ApplicationStatus.refunded ? times.refundedAt : undefined,
    };
  }

  private getActivityLocation(id: number): string {
    const locations = ['台北市 信義區', '新北市 淡水區', '台中市 西區', '台南市 中西區', '桃園市 中壢區', '高雄市 鹽埕區'];
    return locations[(id - 1) % locations.length];
  }

  private getActivityDateTime(activityTime: string): string {
    return `${activityTime} 10:00 - 18:00`;
  }

  private getActivityAddress(id: number): string {
    const addresses = [
      '信義區市集路 81 號',
      '淡水河岸廣場',
      '西區草悟道周邊',
      '中西區海安路廣場',
      '中壢區中央公園草地',
      '鹽埕區倉庫群廣場',
    ];
    return addresses[(id - 1) % addresses.length];
  }

  private getVendorPhone(id: number): string {
    return `0912${String(100000 + id * 34567).slice(0, 6)}`;
  }

  private getVendorEmail(id: number): string {
    return `vendor${String(id).padStart(2, '0')}@marketday.tw`;
  }

  private getVendorAddress(id: number): string {
    const addresses = [
      '台北市信義區市集路 81 號',
      '新北市淡水區河岸路 18 號',
      '台中市西區美村路 35 號',
      '台南市中西區民生路 62 號',
      '桃園市中壢區市集路 85 號',
      '高雄市鹽埕區倉庫路 21 號',
    ];
    return addresses[(id - 1) % addresses.length];
  }

  private getBrandLogo(id: number): string {
    return `assets/images/brand/brand-${String(((id - 1) % 8) + 1).padStart(2, '0')}.png`;
  }

  private getBrandDescription(brandName: string): string {
    return `${brandName} 專注於具有溫度的選物與手作作品，希望在市集中和更多人分享日常裡的小美好。`;
  }

  private getRegistrationPeriod(activityTime: string): string {
    const [start, end] = activityTime.split(' - ');
    return `${start} 13:30 - 20:30\n${end} 13:30 - 20:30`;
  }

  private getBoothCategories(brandType: string): string {
    return `${brandType}、生活選物、文創手作`;
  }
}

