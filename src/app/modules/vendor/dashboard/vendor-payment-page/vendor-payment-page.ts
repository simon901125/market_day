import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PaymentSummary {
  title: string;
  signupCode: string;
  dateRange: string;
  location: string;
  image: string;
  status: string;
  deadlineLabel: string;
  deadline: string;
}

interface FeeItem {
  label: string;
  amount: number;
}

interface PaymentInfoRow {
  label: string;
  value: string;
}

@Component({
  selector: 'app-vendor-payment-page',
  imports: [RouterLink],
  templateUrl: './vendor-payment-page.html',
  styleUrl: './vendor-payment-page.scss',
})
export class VendorPaymentPage {
  /** 報名活動摘要，之後可替換成報名詳細 API 回傳資料。 */
  paymentSummary: PaymentSummary = {
    title: '新動市集・貓貓森林市',
    signupCode: 'MD202406150001',
    dateRange: '2024/06/15 - 2024/06/16',
    location: '新北市板橋區　新板特區公園',
    image: 'assets/images/market/cards/market-card-01.png',
    status: '待付款',
    deadlineLabel: '付款期限',
    deadline: '2024/05/25 23:59',
  };

  /** 付款明細以陣列呈現，未來新增費用項目時不用改 template 結構。 */
  feeItems: FeeItem[] = [
    { label: '攤位費用', amount: 650 },
    { label: '設備租借費用（電力）', amount: 50 },
    { label: '保證金（活動結束後退還）', amount: 1000 },
  ];

  /** 保證金提醒文字集中管理，方便之後依市集規則替換。 */
  depositNotice = {
    title: '關於保證金',
    description: '活動結束且確認無違規事項後，系統將於 7-14 個工作天內原路退還保證金 $1,000。',
  };

  readonly paymentMethod = '信用卡';
  readonly secureNote = '我們不會在此網站儲存您的信用卡資訊，請安心使用。';

  get totalAmount(): number {
    return this.feeItems.reduce((total, item) => total + item.amount, 0);
  }

  get paymentInfoRows(): PaymentInfoRow[] {
    return [
      { label: '付款方式', value: this.paymentMethod },
      { label: '付款金額', value: this.formatCurrency(this.totalAmount) },
      { label: '付款期限', value: this.paymentSummary.deadline },
    ];
  }

  formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }
}
