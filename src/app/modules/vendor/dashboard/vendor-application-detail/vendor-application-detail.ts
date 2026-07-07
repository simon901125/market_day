import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type {
  ApplicationDetail,
  ApplicationStatus,
} from '../../../../models/interface/vendor/VendorApplicationDetail';
import type { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { AlertService } from '../../../../core/services/alert.service';
import { VENDOR_APPLICATION_RECORDS } from '../vendor-application-record/vendor-application-record';

@Component({
  selector: 'app-vendor-application-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-application-detail.html',
  styleUrl: './vendor-application-detail.scss',
})
export class VendorApplicationDetail {
  /** 目前報名編號，由 application-record 點擊查看時透過 route param 帶入。 */
  currentApplicationNo = VENDOR_APPLICATION_RECORDS[0].applicationNo;
  /** 是否顯示頁內彈窗；退款成功提示改由共用 SweetAlert 顯示。 */
  showDialog = false;
  /** 付款明細是否收合 */
  isPaymentDetailOpen = false;
  /** 付款結果假資料；之後串接金流 API 時可由後端回傳決定 success 或 failed。 */
  mockPaymentResult: 'success' | 'failed' = 'success';

  readonly basicEquipment = [
    { name: '桌子（基本）', spec: '180 × 60 公分', quantity: 1, unit: '張' },
    { name: '椅子（基本）', spec: '一般塑膠椅', quantity: 2, unit: '張' },
  ];

  readonly rentalEquipment = [
    {
      name: '桌子（加租）',
      spec: '180 × 60 公分',
      quantity: 1,
      price: 'NT$100 / 張',
      subtotal: 'NT$200（2天）',
    },
    {
      name: '椅子（加租）',
      spec: '一般塑膠椅',
      quantity: 2,
      price: 'NT$50 / 張',
      subtotal: 'NT$100（2天）',
    },
  ];

  readonly extraPower = [
    { voltage: '110V / 1000W', price: 'NT$200 / 天', subtotal: 'NT$400（2天）' },
    { voltage: '220V / 2000W', price: 'NT$400 / 天', subtotal: 'NT$800（2天）' },
  ];

  readonly boothAssignments = [
    { date: '2026/05/30', number: 'A12', zone: 'A 區' },
    { date: '2026/05/31', number: 'A12', zone: 'A 區' },
  ];

  readonly feeBreakdown = [
    {
      label: '報名費',
      content: '2 天（05/30 ＋ 05/31）',
      amount: 'NT$1,300（NT$650 × 2 天）',
    },
    {
      label: '設備租借費',
      content: '桌子（加租）× 1、椅子（加租）× 2',
      amount: 'NT$300（NT$150 × 2 天）',
    },
    {
      label: '額外用電費',
      content: '110V / 1000W、220V / 2000W',
      amount: 'NT$1,200（NT$600 × 2 天）',
    },
    { label: '保證金', content: '活動結束後退還', amount: 'NT$1,000' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alert: AlertService,
  ) {
    const applicationNo = this.route.snapshot.paramMap.get('applicationNo');
    const matchedRecord = VENDOR_APPLICATION_RECORDS.find(
      (record) => record.applicationNo === applicationNo,
    );

    if (matchedRecord) {
      this.currentApplicationNo = matchedRecord.applicationNo;
    }

    this.showDialog = false;
  }

  /** 目前展示的報名狀態，直接由 records 裡的 detail 決定。 */
  get currentStatus(): ApplicationStatus {
    return this.detail.status;
  }

  /** 目前頁面要顯示的詳細資料。 */
  get detail(): ApplicationDetail {
    return this.currentRecord.detail;
  }

  /** 目前報名關聯的市集卡片資料，提供 activity-detail 讀取。 */
  get market(): MarketCardItem {
    return this.currentRecord.market;
  }

  get eventDateText(): string {
    return `${this.formatMarketDate(this.market.start_date)} ${this.market.time}－${this.formatMarketDate(this.market.end_date)} ${this.market.time}`;
  }

  /** 付款總金額。 */
  get paymentTotal(): number {
    return this.detail.paymentLines.reduce((total, item) => total + item.amount, 0);
  }

  /** 目前報名編號對應的列表資料。 */
  private get currentRecord() {
    return (
      VENDOR_APPLICATION_RECORDS.find(
        (record) => record.applicationNo === this.currentApplicationNo,
      ) ?? VENDOR_APPLICATION_RECORDS[0]
    );
  }

  /** 切換展示狀態，方便開發時檢查不同狀態版面。 */
  setStatus(status: ApplicationStatus): void {
    const matchedRecord = VENDOR_APPLICATION_RECORDS.find(
      (record) => record.detail.status === status,
    );

    if (matchedRecord) {
      this.currentApplicationNo = matchedRecord.applicationNo;
    }

    this.showDialog = false;
  }

  /** 執行頁面主要操作。 */
  async handleAction(action: string): Promise<void> {
    if (action === 'requestRefund') {
      const confirmed = await this.openRefundConfirm();

      if (!confirmed) {
        return;
      }

      this.setStatus('refundSuccess');
      await this.openRefundSuccess();
    }
  }

  /** 待審核、待付款狀態取消報名前的二次確認。 */
  async cancelRegistration(): Promise<void> {
    await this.alert.confirmHtml({
      html: this.getCancelRegistrationConfirmHtml(),
      confirmButtonText: '確認取消報名',
      cancelButtonText: '取消',
      popupClass: 'cancel-registration-swal',
    });
  }

  /** 進入獨立付款頁，並以報名編號載入對應的付款資料。 */
  payNow(): void {
    this.router.navigate([
      '/vendor/dash-board/appliction-record/detail',
      this.currentApplicationNo,
      'payment',
    ]);
  }

  /** 顯示付款成功確認畫面。 */
  private openPaymentSuccess(): Promise<unknown> {
    return this.alert.successHtml({
      html: this.getPaymentSuccessHtml(),
      confirmButtonText: '我知道了',
      popupClass: 'payment-result-swal',
      showCloseButton: true,
    });
  }

  /** 顯示付款失敗確認畫面。 */
  private openPaymentFailed(): Promise<unknown> {
    return this.alert.successHtml({
      html: this.getPaymentFailedHtml(),
      confirmButtonText: '重新付款',
      popupClass: 'payment-result-swal',
      showCloseButton: true,
    });
  }

  /** 顯示退款確認視窗，確認後才送出退款申請。 */
  private openRefundConfirm(): Promise<boolean> {
    return this.alert.confirmHtml({
      html: this.getRefundConfirmHtml(),
      confirmButtonText: '確認申請退款',
      cancelButtonText: '取消',
      popupClass: 'refund-confirm-swal',
    });
  }

  /** 顯示退款申請送出成功視窗。 */
  private openRefundSuccess(): Promise<unknown> {
    return this.alert.successHtml({
      html: this.getRefundSuccessHtml(),
      confirmButtonText: '確認',
      popupClass: 'refund-success-swal',
    });
  }

  /** 組合退款確認視窗內容，金額與方式未來可改由 API 帶入。 */
  private getRefundConfirmHtml(): string {
    return `
      <div class="refund-confirm-content">
        <h3>確認申請退款？</h3>
        <p class="refund-confirm-lead">
          申請退款後，主辦單位將進行審核與處理，確認後款項將退回至原付款方式。
        </p>

        <section class="refund-confirm-section">
          <i class="bi bi-currency-dollar"></i>
          <div>
            <h4>退款金額</h4>
            <p class="refund-confirm-amount">
              <strong>$1,700</strong>
              <span>（含攤位費用）</span>
            </p>
          </div>
        </section>

        <section class="refund-confirm-section">
          <i class="bi bi-wallet2"></i>
          <div>
            <h4>退款方式</h4>
            <p><strong>原付款方式退回（信用卡）</strong></p>
            <p>款項將退回至原信用卡帳戶。</p>
          </div>
        </section>

        <section class="refund-confirm-notice">
          <i class="bi bi-info-circle"></i>
          <h4>注意事項</h4>
          <ul>
            <li>保證金不退還。</li>
            <li>退款完成時間依您的發卡銀行或付款平台作業時間為準。</li>
            <li>退款審核結果與退款完成後，將於「通知中心」中通知您。</li>
          </ul>
        </section>

        <p class="refund-confirm-footnote">送出申請後將無法撤回，請確認後再送出。</p>
      </div>
    `;
  }

  /** 組合退款申請成功視窗內容，符合 swal.md 的共用 SweetAlert 使用規範。 */
  private getRefundSuccessHtml(): string {
    return `
      <div class="refund-success-content">
        <div class="refund-success-icon">
          <i class="bi bi-check-lg"></i>
        </div>

        <h3>退款申請已送出！</h3>
        <p>
          您的退款申請已送出，主辦方將進行審核與處理。<br>
          退款處理進度將於「我的報名紀錄」中查看。
        </p>
      </div>
    `;
  }

  /** 組合付款成功視窗內容，符合 swal.md 的共用 SweetAlert 使用規範。 */
  private getPaymentSuccessHtml(): string {
    return `
      <div class="payment-result-content">
        <div class="payment-result-icon success">
          <i class="bi bi-check-lg"></i>
        </div>

        <h3>付款成功！</h3>
        <p>您的報名費用已成功付款，感謝您的報名。</p>
      </div>
    `;
  }

  /** 組合付款失敗視窗內容，金流失敗時可直接重試付款。 */
  private getPaymentFailedHtml(): string {
    return `
      <div class="payment-result-content">
        <div class="payment-result-icon failed">
          <i class="bi bi-x-lg"></i>
        </div>

        <h3>付款失敗！</h3>
        <p>您的付款無法完成，請重新嘗試付款。</p>
      </div>
    `;
  }

  /** 關閉成功彈窗。 */
  closeDialog(): void {
    this.showDialog = false;
  }

  /** 金額格式化。 */
  formatCurrency(amount: number): string {
    return `NT$${amount.toLocaleString()}`;
  }

  /** 組合取消報名確認內容。 */
  private getCancelRegistrationConfirmHtml(): string {
    return `
      <div class="cancel-registration-content">
        <div class="cancel-registration-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>

        <h3>確認取消報名？</h3>
        <p class="cancel-registration-lead">
          取消報名後，將失去本次活動報名資格。<br>
          請確認是否要取消報名。
        </p>

        <section class="cancel-registration-notice">
          <h4><i class="bi bi-exclamation-circle"></i>注意事項</h4>
          <ul>
            <li>取消報名後將無法恢復。</li>
            <li>若要再次參加活動，需重新報名。</li>
            <li>請確認後再送出申請。</li>
          </ul>
        </section>
      </div>
    `;
  }

  private formatMarketDate(value: string): string {
    const parsed = new Date(`${value.replaceAll('/', '-')}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return value;
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][parsed.getDay()];
    return `${value}（${weekday}）`;
  }
}
