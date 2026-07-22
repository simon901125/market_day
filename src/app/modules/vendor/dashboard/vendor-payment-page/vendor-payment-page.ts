import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AlertService } from '../../../../core/services/alert.service';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import type { VendorApplicationApiDetail } from '../../../../models/interface/vendor/VendorApplicationApiDetail';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import type {
  NewebPayPaymentForm,
  VendorPaymentStatus,
} from '../../../../models/interface/vendor/VendorPayment';

@Component({
  selector: 'app-vendor-payment-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-payment-page.html',
  styleUrl: './vendor-payment-page.scss',
})
export class VendorPaymentPage implements OnInit {
  readonly marketStatus = MarketStatus;
  readonly applicationNo: string;
  detailRouteId: string;
  application: VendorApplicationApiDetail | null = null;
  paymentStatus: VendorPaymentStatus | null = null;
  isLoading = true;
  isSubmitting = false;
  loadError = '';

  constructor(
    route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly vendorDashboardService: VendorDashboardService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.applicationNo = route.snapshot.paramMap.get('applicationNo')?.trim() ?? '';
    this.detailRouteId = route.snapshot.queryParamMap.get('applicationId') ?? '';
  }

  ngOnInit(): void {
    if (!this.applicationNo) {
      this.isLoading = false;
      this.loadError = '缺少報名編號，無法載入付款資料。';
      return;
    }
    this.loadPaymentStatus();
  }

  /** 從藍新金流按上一頁返回時，瀏覽器可能直接還原 BFCache 中的元件狀態。 */
  @HostListener('window:pageshow')
  onPageShow(): void {
    this.isSubmitting = false;
  }

  get feeItems() {
    return (this.application?.feedetail ?? []).filter((item) => item.item !== '總計');
  }

  get total(): number {
    return this.paymentStatus?.applicationAmount
      ?? this.application?.fee.paymentAmount
      ?? this.application?.feedetail.find((item) => item.item === '總計')?.amount
      ?? 0;
  }

  get paymentDeadline(): string {
    const value = this.paymentStatus?.paymentDueAt;
    return value ? new Date(value).toLocaleString('zh-TW', { hour12: false }) : '依報名審核通知為準';
  }

  get isPaid(): boolean {
    return this.paymentStatus?.applicationPaymentStatus === 'PAID';
  }

  async continueToCreditCard(): Promise<void> {
    if (this.isSubmitting || this.isPaid) return;

    this.isSubmitting = true;
    this.vendorDashboardService.createNewebPayPayment(this.applicationNo).subscribe({
      next: async (response) => {
        if (!isApiSuccessStatus(response.statusCode)) {
          this.isSubmitting = false;
          await this.alert.error('無法建立付款', response.message);
          return;
        }

        try {
          this.submitNewebPayForm(response.data);
        } catch {
          this.isSubmitting = false;
          await this.alert.error('無法前往藍新金流', '付款網址格式不正確，請聯絡客服。');
        }
      },
      error: async () => {
        this.isSubmitting = false;
        await this.alert.error('無法建立付款', '目前無法連線付款服務，請稍後再試。');
      },
    });
  }

  private loadPaymentStatus(): void {
    this.vendorDashboardService.getVendorPaymentStatus(this.applicationNo).subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode)) {
          this.finishWithError(response.message);
          return;
        }
        this.paymentStatus = response.data;
        this.detailRouteId = String(response.data.applicationId);
        this.loadApplicationDetail(response.data.applicationId);
      },
      error: () => this.finishWithError('目前無法載入付款資料，請稍後再試。'),
    });
  }

  private loadApplicationDetail(applicationId: number): void {
    this.vendorDashboardService.getVendorApplicationDetail(applicationId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (!isApiSuccessStatus(response.statusCode)) {
          this.finishWithError(response.message);
          return;
        }
        this.application = response.data;
        void this.showReturnResult();
      },
      error: () => this.finishWithError('目前無法載入報名資料，請稍後再試。'),
    });
  }

  private async showReturnResult(): Promise<void> {
    const returned = this.router.url.includes('paymentNo=') || this.router.url.includes('paymentStatus=');
    if (!returned) return;

    if (this.isPaid) {
      await this.alert.success('付款成功', '款項已確認入帳，報名狀態已更新。', '查看報名詳情');
      await this.router.navigate(['/vendor/dash-board/application-record/detail', this.detailRouteId]);
    } else {
      await this.alert.error('付款未完成', '交易未成功，請確認付款資訊後重新嘗試。');
    }
  }

  private submitNewebPayForm(payment: NewebPayPaymentForm): void {
    const gateway = new URL(payment.gateway);
    if (gateway.protocol !== 'https:' || !gateway.hostname.toLowerCase().endsWith('.newebpay.com')) {
      throw new Error('Invalid NewebPay gateway');
    }

    const form = this.document.createElement('form');
    form.method = 'POST';
    form.action = gateway.toString();
    form.style.display = 'none';

    const fields: Record<string, string> = {
      MerchantID: payment.merchantId,
      TradeInfo: payment.tradeInfo,
      TradeSha: payment.tradeSha,
      Version: payment.version,
    };
    for (const [name, value] of Object.entries(fields)) {
      const input = this.document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    }
    this.document.body.appendChild(form);
    form.submit();
  }

  private finishWithError(message: string): void {
    this.isLoading = false;
    this.loadError = message;
    void this.alert.error('付款資料載入失敗', message);
  }
}
