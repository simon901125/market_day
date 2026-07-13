import { DecimalPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AlertService } from '../../../../core/services/alert.service';
import { VENDOR_APPLICATION_RECORDS } from '../vendor-application-record/vendor-application-record';

@Component({
  selector: 'app-vendor-payment-page',
  imports: [DecimalPipe, NgClass, RouterLink],
  templateUrl: './vendor-payment-page.html',
  styleUrl: './vendor-payment-page.scss',
})
export class VendorPaymentPage {
  private readonly paymentRecord =
    VENDOR_APPLICATION_RECORDS.find((record) => record.status === 'payment') ??
    VENDOR_APPLICATION_RECORDS[0];

  readonly record;
  readonly boothFee: number;
  readonly equipmentRentalFee = 0;
  readonly extraPowerFee = 50;
  readonly deposit = 1000;

  constructor(
    route: ActivatedRoute,
    private readonly alert: AlertService,
  ) {
    const applicationNo = route.snapshot.paramMap.get('applicationNo');
    this.record =
      VENDOR_APPLICATION_RECORDS.find((record) => record.applicationNo === applicationNo) ??
      this.paymentRecord;
    this.boothFee = this.record.market.price ?? 650;
  }

  get detail() {
    return this.record.detail;
  }

  get market() {
    return this.record.market;
  }

  get eventDateText(): string {
    return `${this.market.start_date} - ${this.market.end_date}　${this.market.time}`;
  }

  get paymentDeadline(): string {
    return (
      this.detail.paymentRows.find((row) => row.label === '付款期限')?.value ?? '2026/06/05 23:59'
    );
  }

  get total(): number {
    return this.boothFee + this.equipmentRentalFee + this.extraPowerFee + this.deposit;
  }

  async continueToCreditCard(): Promise<void> {
    await this.alert.info(
      '即將前往信用卡付款',
      '金流服務串接完成後，將由此安全導向信用卡付款頁面。',
      '我知道了',
    );
  }
}
