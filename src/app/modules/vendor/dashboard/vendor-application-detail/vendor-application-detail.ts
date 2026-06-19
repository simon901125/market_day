import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type ApplicationStatus = 'completed' | 'cancelled' | 'refunded' | 'refundApplying' | 'refundProcessing';
type SideCardType = 'booth' | 'refund';

interface DetailRow {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ProgressStep {
  label: string;
  value: string;
}

interface PaymentLine {
  label: string;
  amount: number;
}

interface BoothInfo {
  selected: boolean;
  rows: DetailRow[];
  actionLabel?: string;
  emptyTitle?: string;
  emptyText?: string;
}

interface SideCard {
  type: SideCardType;
  title: string;
  icon: string;
  rows: DetailRow[];
  notice?: string;
}

interface ApplicationDetail {
  status: ApplicationStatus;
  statusText: string;
  statusClass: string;
  title: string;
  applicationNo: string;
  dateRange: string;
  location: string;
  image: string;
  progress: ProgressStep[];
  applicationRows: DetailRow[];
  paymentRows: DetailRow[];
  paymentLines: PaymentLine[];
  booth: BoothInfo;
  sideCard: SideCard;
}

interface ApplicationSummary {
  title: string;
  dateRange: string;
  location: string;
  image: string;
}

@Component({
  selector: 'app-vendor-application-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './vendor-application-detail.html',
  styleUrl: './vendor-application-detail.scss',
})
export class VendorApplicationDetail {
  /** 目前展示的報名狀態；之後可改由 route param 或 API 回傳決定。 */
  currentStatus: ApplicationStatus = 'refundApplying';

  /** 目前報名編號；由 register-record 點擊查看時透過 route param 帶入。 */
  currentApplicationNo = 'MD202406150001';

  /** 報名詳細假資料，所有畫面文字都由這裡綁定到 template。 */
  applicationDetails: Record<ApplicationStatus, ApplicationDetail> = {
    completed: this.createCompletedDetail(),
    cancelled: this.createCancelledDetail(),
    refunded: this.createRefundedDetail(),
    refundApplying: this.createRefundApplyingDetail(),
    refundProcessing: this.createRefundProcessingDetail(),
  };

  /** 報名編號與狀態的對應，之後串接 API 時可改由後端查詢單筆資料。 */
  applicationStatusMap: Record<string, ApplicationStatus> = {
    MD202406150001: 'refundApplying',
    MD202406220032: 'refundProcessing',
    MD202405040018: 'refunded',
    MD202406150045: 'completed',
    MD202405010009: 'completed',
    MD202407060011: 'cancelled',
    MD202407130020: 'cancelled',
    MD202404200027: 'cancelled',
    MD202407200016: 'completed',
    MD202408030008: 'completed',
  };

  /** 報名編號與活動摘要的對應，讓 detail 顯示點選的那筆資料。 */
  applicationSummaryMap: Record<string, ApplicationSummary> = {
    MD202406150001: {
      title: '新動市集・貓貓森林市',
      dateRange: '2024/06/15 - 2024/06/16',
      location: '新北市板橋區 新板特區公園',
      image: 'assets/images/market/cards/market-card-01.png',
    },
    MD202406220032: {
      title: '春日手作生活節',
      dateRange: '2024/06/22 - 2024/06/23',
      location: '台中市西區 草悟道廣場',
      image: 'assets/images/market/cards/market-card-02.png',
    },
    MD202405040018: {
      title: '海風手作市集',
      dateRange: '2024/05/04 - 2024/05/05',
      location: '高雄市新津區 旗津貝殼館廣場',
      image: 'assets/images/market/cards/market-card-03.png',
    },
    MD202406150045: {
      title: '植感生活市集',
      dateRange: '2024/06/15 - 2024/06/16',
      location: '台南市新營區 長勝營區市地',
      image: 'assets/images/market/cards/market-card-04.png',
    },
    MD202405010009: {
      title: '小森散步市集',
      dateRange: '2024/05/01 - 2024/05/02',
      location: '桃園市八德區 八德埤塘・生態公園',
      image: 'assets/images/market/cards/market-card-05.png',
    },
    MD202407060011: {
      title: '甜點微光市集',
      dateRange: '2024/07/06 - 2024/07/07',
      location: '台北市中正區 華山文創園區',
      image: 'assets/images/market/cards/market-card-06.png',
    },
    MD202407130020: {
      title: '城市選物市集',
      dateRange: '2024/07/13 - 2024/07/14',
      location: '新竹市東區 關新公園',
      image: 'assets/images/market/cards/market-card-07.png',
    },
    MD202404200027: {
      title: '慢生活週末市集',
      dateRange: '2024/04/20 - 2024/04/21',
      location: '嘉義市東區 森林之歌廣場',
      image: 'assets/images/market/cards/market-card-08.png',
    },
    MD202407200016: {
      title: '花園午茶市集',
      dateRange: '2024/07/20 - 2024/07/21',
      location: '台北市信義區 香堤大道廣場',
      image: 'assets/images/market/cards/market-card-09.png',
    },
    MD202408030008: {
      title: '夏夜文創市集',
      dateRange: '2024/08/03 - 2024/08/04',
      location: '高雄市鹽埕區 駁二藝術特區',
      image: 'assets/images/market/cards/market-card-10.png',
    },
  };

  constructor(private route: ActivatedRoute) {
    const applicationNo = this.route.snapshot.paramMap.get('applicationNo');

    if (applicationNo) {
      this.currentApplicationNo = applicationNo;
      this.currentStatus = this.applicationStatusMap[applicationNo] ?? 'refundApplying';
    }
  }

  /** 目前頁面要顯示的詳細資料。 */
  get detail(): ApplicationDetail {
    const summary = this.applicationSummaryMap[this.currentApplicationNo];

    return {
      ...this.applicationDetails[this.currentStatus],
      applicationNo: this.currentApplicationNo,
      ...(summary ?? {}),
    };
  }

  /** 付款總金額。 */
  get paymentTotal(): number {
    return this.detail.paymentLines.reduce((total, item) => total + item.amount, 0);
  }

  /** 切換展示狀態，方便開發時檢查不同報名狀態版面。 */
  setStatus(status: ApplicationStatus): void {
    this.currentStatus = status;
  }

  /** 金額格式化。 */
  formatCurrency(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  private createRefundApplyingDetail(): ApplicationDetail {
    return {
      ...this.baseDetail('refundApplying', '退款申請中', 'refund-applying'),
      progress: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 16:45' },
        { label: '退款申請時間', value: '2026/06/07 15:55' },
        { label: '退款審核時間', value: '尚未完成' },
        { label: '退款時間', value: '尚未完成' },
      ],
      paymentRows: [
        { label: '付款狀態', value: '已付款' },
        { label: '付款方式', value: '信用卡' },
        { label: '付款金額', value: '$1,700' },
        { label: '付款時間', value: '2026/06/03 16:45' },
      ],
      paymentLines: [],
      sideCard: {
        type: 'refund',
        title: '退款資訊',
        icon: 'bi-currency-dollar',
        rows: [
          { label: '退款狀態', value: '退款申請中', highlight: true },
          { label: '退款金額', value: '$1,700', highlight: true },
          { label: '申請時間', value: '2026/06/06 10:30' },
          { label: '預計退款', value: '7 - 14 個工作天' },
          { label: '退款方式', value: '原付款方式退回' },
        ],
        notice:
          '主辦單位已收到您的退款申請，正在進行審核與處理，款項將依原付款方式退回。若有疑問，請聯繫主辦單位。',
      },
      booth: this.emptyBooth('退款申請中，暫停攤位操作。'),
    };
  }

  private createCompletedDetail(): ApplicationDetail {
    return {
      ...this.baseDetail('completed', '報名完成', 'completed'),
      progress: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '付款時間', value: '2026/06/03 16:45' },
        { label: '攤位完成時間', value: '2026/06/04 11:20' },
        { label: '最終確認時間', value: '尚未完成' },
        { label: '保證金退還', value: '尚未完成' },
      ],
      sideCard: {
        type: 'booth',
        title: '攤位資訊',
        icon: 'bi-shop',
        rows: [
          { label: '攤位編號', value: 'A12' },
          { label: '區域', value: 'A區' },
          { label: '選位時間', value: '2026/06/04 11:20' },
          { label: '進場時間', value: '2026/06/15 12:30' },
        ],
      },
    };
  }

  private createCancelledDetail(): ApplicationDetail {
    return {
      ...this.baseDetail('cancelled', '已取消', 'cancelled'),
      progress: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '取消時間', value: '2026/06/06 00:00' },
      ],
      paymentRows: [
        { label: '付款狀態', value: '已逾期', highlight: true },
        { label: '付款期限', value: '2026/06/05 23:59' },
        { label: '付款金額', value: '$1,700' },
        { label: '保證金', value: '$1,000' },
      ],
      paymentLines: [],
      sideCard: {
        type: 'booth',
        title: '攤位資訊',
        icon: 'bi-shop',
        rows: [],
        notice: '尚未選擇攤位｜報名已取消，無法選擇攤位。',
      },
      booth: this.emptyBooth('報名已取消，無法選擇攤位。'),
    };
  }

  private createRefundedDetail(): ApplicationDetail {
    return {
      ...this.baseDetail('refunded', '已退款', 'refunded'),
      progress: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '退款完成時間', value: '2026/06/09 10:20' },
      ],
      paymentRows: [
        { label: '付款狀態', value: '已退款', highlight: true },
        { label: '退款時間', value: '2026/06/09 10:20' },
        { label: '退款金額', value: '$1,700' },
      ],
      paymentLines: [],
      sideCard: {
        type: 'refund',
        title: '退款資訊',
        icon: 'bi-currency-dollar',
        rows: [
          { label: '退款狀態', value: '已退款', highlight: true },
          { label: '退款金額', value: '$1,700', highlight: true },
          { label: '退款時間', value: '2026/06/09 10:20' },
        ],
      },
    };
  }

  private createRefundProcessingDetail(): ApplicationDetail {
    return {
      ...this.baseDetail('refundProcessing', '退款處理中', 'refund-processing'),
      progress: [
        { label: '報名時間', value: '2026/06/01 14:30' },
        { label: '審核時間', value: '2026/06/02 15:30' },
        { label: '退款申請時間', value: '2026/06/07 09:15' },
      ],
      paymentRows: [
        { label: '付款狀態', value: '退款處理中', highlight: true },
        { label: '申請時間', value: '2026/06/07 09:15' },
        { label: '退款金額', value: '$1,700' },
      ],
      paymentLines: [],
      sideCard: {
        type: 'refund',
        title: '退款資訊',
        icon: 'bi-currency-dollar',
        rows: [
          { label: '退款狀態', value: '退款處理中', highlight: true },
          { label: '退款金額', value: '$1,700', highlight: true },
          { label: '預計退款', value: '7 - 14 個工作天' },
        ],
      },
    };
  }

  private baseDetail(
    status: ApplicationStatus,
    statusText: string,
    statusClass: string,
  ): ApplicationDetail {
    return {
      status,
      statusText,
      statusClass,
      title: '新動市集・貓貓森林市',
      applicationNo: 'MD202406150001',
      dateRange: '2024/06/15 - 2024/06/16',
      location: '新北市板橋區 新板特區公園',
      image: 'assets/images/market/cards/market-card-01.png',
      progress: [],
      applicationRows: this.baseApplicationRows(),
      paymentRows: [
        { label: '付款狀態', value: '已付款' },
        { label: '付款方式', value: '信用卡' },
        { label: '付款時間', value: '2026/06/03 16:45' },
      ],
      paymentLines: this.basePaymentLines(),
      booth: {
        selected: true,
        rows: [
          { label: '攤位編號', value: 'A12' },
          { label: '區域', value: 'A區' },
          { label: '選位時間', value: '2026/06/04 11:20' },
          { label: '進場時間', value: '2026/06/15 12:30' },
        ],
        actionLabel: '查看攤位地圖',
      },
      sideCard: {
        type: 'booth',
        title: '攤位資訊',
        icon: 'bi-shop',
        rows: [],
      },
    };
  }

  private baseApplicationRows(): DetailRow[] {
    return [
      { label: '參加場次', value: '2024/06/15（六）' },
      { label: '攤位類型', value: '2*3米 / 2*3米 / 1.5米' },
      { label: '攤位類別', value: '寵物生活' },
      { label: '租借設備', value: '電力 $50/天' },
      { label: '使用電器與瓦數', value: '小型製冰機 300W' },
      { label: '車牌登記', value: 'ABC-1234' },
      { label: '備註', value: '-' },
    ];
  }

  private basePaymentLines(): PaymentLine[] {
    return [
      { label: '攤位費用', amount: 650 },
      { label: '租借設備 - 電力', amount: 50 },
      { label: '保證金', amount: 1000 },
    ];
  }

  private emptyBooth(emptyText: string): BoothInfo {
    return {
      selected: false,
      rows: [],
      emptyTitle: '尚未選擇攤位',
      emptyText,
    };
  }
}
