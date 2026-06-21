import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { ApplicationDetail, ApplicationStatus } from '../../../../models/interface/VendorApplicationDetail';
import type { MarketCardItem } from '../../../../models/interface/MarketCardItem';
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
  /** 是否顯示退款申請成功彈窗。 */
  showDialog = false;
  /** 付款明細是否收合 */
  isPaymentDetailOpen = false;

  constructor(private route: ActivatedRoute) {
    const applicationNo = this.route.snapshot.paramMap.get('applicationNo');
    const matchedRecord = VENDOR_APPLICATION_RECORDS.find((record) => record.applicationNo === applicationNo);

    if (matchedRecord) {
      this.currentApplicationNo = matchedRecord.applicationNo;
    }

    this.showDialog = this.detail.status === 'refundSuccess';
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

  /** 付款總金額。 */
  get paymentTotal(): number {
    return this.detail.paymentLines.reduce((total, item) => total + item.amount, 0);
  }

  /** 目前報名編號對應的列表資料。 */
  private get currentRecord() {
    return (
      VENDOR_APPLICATION_RECORDS.find((record) => record.applicationNo === this.currentApplicationNo) ??
      VENDOR_APPLICATION_RECORDS[0]
    );
  }

  /** 切換展示狀態，方便開發時檢查不同狀態版面。 */
  setStatus(status: ApplicationStatus): void {
    const matchedRecord = VENDOR_APPLICATION_RECORDS.find((record) => record.detail.status === status);

    if (matchedRecord) {
      this.currentApplicationNo = matchedRecord.applicationNo;
    }

    this.showDialog = status === 'refundSuccess';
  }

  /** 執行頁面主要操作。 */
  handleAction(action: string): void {
    if (action === 'requestRefund') {
      this.setStatus('refundSuccess');
    }
  }

  /** 關閉成功彈窗。 */
  closeDialog(): void {
    this.showDialog = false;
  }

  /** 金額格式化。 */
  formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }
}
