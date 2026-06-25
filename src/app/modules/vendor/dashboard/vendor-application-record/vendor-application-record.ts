import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { AlertService } from '../../../../core/services/alert.service';
import type {
  ApplicationDetail,
  ApplicationRecord,
  ApplicationRecordStatus,
  ApplicationStatus,
  BoothInfo,
  DetailRow,
  PaymentLine,
  ProgressStep,
  RecordAction,
  RecordTab,
} from '../../../../models/interface/vendor/VendorApplicationDetail';
import type { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

const DETAIL_LINK = '/vendor/dash-board/appliction-record/detail';

type MarketKey = string;
type RecordActionType = 'view' | 'payment' | 'booth' | 'refund' | 'review';

interface ApplicationRecordJson {
  id: number;
  marketKey: MarketKey;
  marketName: string;
  eventDate: string;
  location: string;
  applicationNo: string;
  status: ApplicationRecordStatus;
  statusText: string;
  statusClass: string;
  actionTypes: RecordActionType[];
  detailType: ApplicationStatus;
}

const RECORD_ACTION_MAP: Record<RecordActionType, RecordAction> = {
  view: { label: '查看', style: 'outline', link: DETAIL_LINK },
  payment: { label: '付款', style: 'primary', link: DETAIL_LINK },
  booth: { label: '選擇攤位', style: 'primary', link: DETAIL_LINK },
  refund: { label: '退款', style: 'primary',link: DETAIL_LINK },
  review: { label: '審核', style: 'primary',link: DETAIL_LINK },
};

const DETAIL_FACTORY_MAP: Record<ApplicationStatus, () => ApplicationDetail> = {
  reviewing: createReviewingDetail,
  payment: createPaymentDetail,
  completed: createCompletedDetail,
  depositRefunded: createDepositRefundedDetail,
  cancelled: createCancelledDetail,
  refunded: createRefundedDetail,
  refundApplying: createRefundApplyingDetail,
  refundProcessing: createRefundProcessingDetail,
  refundSuccess: createRefundSuccessDetail,
};

/** 報名紀錄關聯的市集卡片資料，activity-detail 可直接讀取這份 MarketCardItem。 */
export const VENDOR_APPLICATION_MARKETS: Record<string, MarketCardItem> = {
  forestCat: createMarket({
    imageNo: 1,
    title: '新動市集・貓貓森林市',
    start_date: '2024/06/15',
    end_date: '2024/06/16',
    location: '新北市板橋區 新板特區公園',
    address: '新北市板橋區縣民大道二段周邊',
    city: '新北市',
    area: '板橋區',
    category: '寵物生活',
    tags: ['寵物生活', '文創手作', '親子家庭'],
  }),
  springHandmade: createMarket({
    imageNo: 2,
    title: '春日手作生活節',
    start_date: '2024/06/22',
    end_date: '2024/06/23',
    location: '台中市西區 草悟道廣場',
    address: '台中市西區公益路68號周邊',
    city: '台中市',
    area: '西區',
    category: '文創手作',
    tags: ['文創手作', '餐飲美食'],
  }),
  seaHandmade: createMarket({
    imageNo: 3,
    title: '海風手作市集',
    start_date: '2024/05/04',
    end_date: '2024/05/05',
    location: '高雄市新津區 旗津貝殼館廣場',
    address: '高雄市旗津區旗津三路990號',
    city: '高雄市',
    area: '旗津區',
    category: '文創手作',
    tags: ['文創手作', '餐飲美食'],
  }),
  plantLife: createMarket({
    imageNo: 4,
    title: '植感生活市集',
    start_date: '2024/06/15',
    end_date: '2024/06/16',
    location: '台南市新營區 長勝營區市地',
    address: '台南市新營區長勝營區周邊',
    city: '台南市',
    area: '新營區',
    category: '植物選物',
    tags: ['植物選物', '文創手作'],
  }),
  forestWalk: createMarket({
    imageNo: 5,
    title: '小森散步市集',
    start_date: '2024/05/01',
    end_date: '2024/05/02',
    location: '桃園市八德區 八德埤塘・生態公園',
    address: '桃園市八德區興豐路1315號',
    city: '桃園市',
    area: '八德區',
    category: '親子家庭',
    tags: ['親子家庭', '玩具禮物'],
  }),
  dessertLight: createMarket({
    imageNo: 6,
    title: '甜點微光市集',
    start_date: '2024/07/06',
    end_date: '2024/07/07',
    location: '台北市中正區 華山文創園區',
    address: '台北市中正區八德路一段1號',
    city: '台北市',
    area: '中正區',
    category: '餐飲美食',
    tags: ['餐飲美食', '文創手作'],
  }),
  citySelect: createMarket({
    imageNo: 7,
    title: '城市選物市集',
    start_date: '2024/07/13',
    end_date: '2024/07/14',
    location: '新竹市東區 關新公園',
    address: '新竹市東區關新路周邊',
    city: '新竹市',
    area: '東區',
    category: '服飾配件',
    tags: ['服飾配件', '文創手作'],
  }),
  slowWeekend: createMarket({
    imageNo: 8,
    title: '慢生活週末市集',
    start_date: '2024/04/20',
    end_date: '2024/04/21',
    location: '嘉義市東區 森林之歌廣場',
    address: '嘉義市東區文化路周邊',
    city: '嘉義市',
    area: '東區',
    category: '文創手作',
    tags: ['文創手作', '餐飲美食'],
  }),
  gardenTea: createMarket({
    imageNo: 9,
    title: '花園午茶市集',
    start_date: '2024/07/20',
    end_date: '2024/07/21',
    location: '台北市信義區 香堤大道廣場',
    address: '台北市信義區松壽路周邊',
    city: '台北市',
    area: '信義區',
    category: '餐飲美食',
    tags: ['餐飲美食', '親子家庭'],
  }),
  summerNight: createMarket({
    imageNo: 10,
    title: '夏夜文創市集',
    start_date: '2024/08/03',
    end_date: '2024/08/04',
    location: '高雄市鹽埕區 駁二藝術特區',
    address: '高雄市鹽埕區大勇路1號',
    city: '高雄市',
    area: '鹽埕區',
    category: '文創手作',
    tags: ['文創手作', '餐飲美食'],
  }),
};

/** 報名紀錄 JSON 假資料；只保留 API 會回傳的純資料與 action key。 */
export const VENDOR_APPLICATION_RECORD_JSON: ApplicationRecordJson[] = [
  {
    id: 1,
    marketKey: 'forestCat',
    marketName: '新動市集・貓貓森林市',
    eventDate: '2024/06/15 - 2024/06/16',
    location: '新北市板橋區 新板特區公園',
    applicationNo: 'MD202406150001',
    status: 'refundApplying',
    statusText: '退款申請中',
    statusClass: 'refund-applying',
    actionTypes: ['view'],
    detailType: 'refundApplying',
  },
  {
    id: 2,
    marketKey: 'springHandmade',
    marketName: '春日手作生活節',
    eventDate: '2024/06/22 - 2024/06/23',
    location: '台中市西區 草悟道廣場',
    applicationNo: 'MD202406220032',
    status: 'refundProcessing',
    statusText: '退款處理中',
    statusClass: 'refund-processing',
    actionTypes: ['view'],
    detailType: 'refundProcessing',
  },
  {
    id: 3,
    marketKey: 'seaHandmade',
    marketName: '海風手作市集',
    eventDate: '2024/05/04 - 2024/05/05',
    location: '高雄市新津區 旗津貝殼館廣場',
    applicationNo: 'MD202405040018',
    status: 'refunded',
    statusText: '已退款',
    statusClass: 'refunded',
    actionTypes: ['view'],
    detailType: 'refunded',
  },
  {
    id: 4,
    marketKey: 'plantLife',
    marketName: '植感生活市集',
    eventDate: '2024/06/15 - 2024/06/16',
    location: '台南市新營區 長勝營區市地',
    applicationNo: 'MD202406150045',
    status: 'completed',
    statusText: '報名完成',
    statusClass: 'completed',
    actionTypes: ['view'],
    detailType: 'completed',
  },
  {
    id: 5,
    marketKey: 'forestWalk',
    marketName: '小森散步市集',
    eventDate: '2024/05/01 - 2024/05/02',
    location: '桃園市八德區 八德埤塘・生態公園',
    applicationNo: 'MD202405010009',
    status: 'booth',
    statusText: '待選位',
    statusClass: 'booth',
    actionTypes: ['booth', 'refund'],
    detailType: 'refundSuccess',
  },
  {
    id: 6,
    marketKey: 'dessertLight',
    marketName: '甜點微光市集',
    eventDate: '2024/07/06 - 2024/07/07',
    location: '台北市中正區 華山文創園區',
    applicationNo: 'MD202407060011',
    status: 'payment',
    statusText: '待付款',
    statusClass: 'payment',
    actionTypes: ['payment'],
    detailType: 'payment',
  },
  {
    id: 7,
    marketKey: 'citySelect',
    marketName: '城市選物市集',
    eventDate: '2024/07/13 - 2024/07/14',
    location: '新竹市東區 關新公園',
    applicationNo: 'MD202407130020',
    status: 'reviewing',
    statusText: '待審核',
    statusClass: 'reviewing',
    actionTypes: ['review'],
    detailType: 'reviewing',
  },
  {
    id: 8,
    marketKey: 'slowWeekend',
    marketName: '慢生活週末市集',
    eventDate: '2024/04/20 - 2024/04/21',
    location: '嘉義市東區 森林之歌廣場',
    applicationNo: 'MD202404200027',
    status: 'history',
    statusText: '已取消',
    statusClass: 'history',
    actionTypes: ['view'],
    detailType: 'cancelled',
  },
  {
    id: 9,
    marketKey: 'gardenTea',
    marketName: '花園午茶市集',
    eventDate: '2024/07/20 - 2024/07/21',
    location: '台北市信義區 香堤大道廣場',
    applicationNo: 'MD202407200016',
    status: 'depositRefunded',
    statusText: '保證金已退還',
    statusClass: 'deposit-refunded',
    actionTypes: ['view'],
    detailType: 'depositRefunded',
  },
  {
    id: 10,
    marketKey: 'summerNight',
    marketName: '夏夜文創市集',
    eventDate: '2024/08/03 - 2024/08/04',
    location: '高雄市鹽埕區 駁二藝術特區',
    applicationNo: 'MD202408030008',
    status: 'booth',
    statusText: '待選位',
    statusClass: 'booth',
    actionTypes: ['booth', 'refund'],
    detailType: 'refundSuccess',
  },
];

/** 將 JSON 假資料轉成畫面與詳細頁可直接使用的完整 record。 */
export const VENDOR_APPLICATION_RECORDS: ApplicationRecord[] = VENDOR_APPLICATION_RECORD_JSON.map(createRecord);

@Component({
  selector: 'app-vendor-application-record',
  imports: [CommonModule, RouterLink, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './vendor-application-record.html',
  styleUrl: './vendor-application-record.scss',
})
export class VendorApplicationRecord {
  /** 目前選取的報名狀態分頁，預設顯示全部紀錄。 */
  activeTab: RecordTab['value'] = 'all';

  /** 目前頁碼，會傳給共用 app-dashboard-pagination。 */
  currentPage = 1;

  /** 每頁顯示筆數，依設計稿頁尾顯示 1 - 8 筆設定。 */
  pageSize = 6;

  /** 報名狀態下拉選單選項，對齊 OrganizerEventManagement 的活動篩選使用方式。 */
  readonly statusOptions = [
    '全部狀態',
    '待審核',
    '待付款',
    '待選位',
    '報名完成',
    '保證金已退還',
    '退款申請中',
    '退款處理中',
    '已退款',
    '歷史紀錄',
  ];

  /** 下拉選單文字與資料狀態代碼的對應。 */
  private readonly statusValueMap: Record<string, RecordTab['value']> = {
    全部狀態: 'all',
    待審核: 'reviewing',
    待付款: 'payment',
    待選位: 'booth',
    報名完成: 'completed',
    保證金已退還: 'depositRefunded',
    退款申請中: 'refundApplying',
    退款處理中: 'refundProcessing',
    已退款: 'refunded',
    歷史紀錄: 'history',
  };

  /** 報名狀態分頁資料，之後可依 API 狀態欄位調整 value。 */
  tabs: RecordTab[] = [
    { label: '全部', value: 'all' },
    { label: '待審核', value: 'reviewing' },
    { label: '待付款', value: 'payment' },
    { label: '待選位', value: 'booth' },
    { label: '報名完成', value: 'completed' },
    { label: '保證金已退還', value: 'depositRefunded' },
    { label: '退款申請中', value: 'refundApplying' },
    { label: '退款處理中', value: 'refundProcessing' },
    { label: '已退款', value: 'refunded' },
    { label: '歷史紀錄', value: 'history' },
  ];

  /** 報名紀錄假資料；每筆資料內的 detail 可供詳細頁直接使用。 */
  records: ApplicationRecord[] = VENDOR_APPLICATION_RECORDS;

  constructor(private alert: AlertService) {}

  /** 目前下拉選單顯示文字。 */
  get selectedStatusLabel(): string {
    return this.statusOptions.find((option) => this.statusValueMap[option] === this.activeTab) ?? '';
  }

  /** 依目前分頁篩選後的紀錄。 */
  get filteredRecords(): ApplicationRecord[] {
    if (this.activeTab === 'all') {
      return this.records;
    }

    return this.records.filter((record) => record.status === this.activeTab);
  }

  /** 目前頁面要顯示的紀錄資料。 */
  get pagedRecords(): ApplicationRecord[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(startIndex, startIndex + this.pageSize);
  }

  /** 切換狀態分頁時回到第一頁。 */
  setActiveTab(tab: RecordTab['value']): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  /** 選取報名狀態後重設到第一頁，行為對齊 OrganizerEventManagement 的 selectStatus。 */
  selectStatus(status: string): void {
    this.activeTab = this.statusValueMap[status] ?? 'all';
    this.currentPage = 1;
  }

  /** 接收共用分頁元件送出的頁碼。 */
  setPage(page: number): void {
    this.currentPage = page;
  }

  /** 處理列表操作按鈕；退款需先經過確認視窗。 */
  async handleRecordAction(action: RecordAction, record: ApplicationRecord): Promise<void> {
    if (action.label !== '退款') {
      return;
    }

    const confirmed = await this.alert.confirmHtml({
      html: this.getRefundConfirmHtml(record),
      confirmButtonText: '確認申請退款',
      cancelButtonText: '取消',
      popupClass: 'refund-confirm-swal',
    });

    if (!confirmed) {
      return;
    }

    await this.alert.successHtml({
      html: this.getRefundSuccessHtml(),
      confirmButtonText: '確認',
      popupClass: 'refund-success-swal',
    });
  }

  /** 組合列表退款確認內容，金額與付款方式未來可由 API 回傳資料取代。 */
  private getRefundConfirmHtml(record: ApplicationRecord): string {
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
            <p>${record.marketName} 的款項將退回至原信用卡帳戶。</p>
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

  /** 組合退款申請送出成功提示，與詳細頁使用相同 SweetAlert 樣式。 */
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
}

function createRecord(record: ApplicationRecordJson): ApplicationRecord {
  const { marketKey, actionTypes, detailType, ...listRecord } = record;
  const market = VENDOR_APPLICATION_MARKETS[marketKey];
  const detail = DETAIL_FACTORY_MAP[detailType]();

  return {
    ...listRecord,
    image: market.image,
    market,
    actions: actionTypes.map((type) => ({ ...RECORD_ACTION_MAP[type] })),
    detail: {
      ...detail,
      title: listRecord.marketName,
      applicationNo: listRecord.applicationNo,
      dateRange: listRecord.eventDate,
      location: listRecord.location,
      image: market.image,
    },
  };
}

function createMarket(market: Omit<MarketCardItem, 'time' | 'description' | 'image' | 'status' | 'statusClass' | 'organizer' | 'transportation' | 'slots' | 'price'> & { imageNo: number }): MarketCardItem {
  const { imageNo, ...marketInfo } = market;

  return {
    ...marketInfo,
    time: '13:30 - 20:30',
    description: `${market.title} 聚集特色品牌、手作設計與生活風格攤位，適合慢慢逛、好好交流。`,
    image: imagePath(imageNo),
    status: MarketStatus.ended,
    statusClass: MarketStatus.getClass(MarketStatus.ended),
    organizer: '小集日活動企劃',
    transportation: ['捷運或台鐵轉乘公車可抵達', '活動周邊設有收費停車場'],
    slots: [
      { date: market.start_date.slice(5), remaining: 12 },
      { date: market.end_date.slice(5), remaining: 8 },
    ],
    price: 650,
  };
}

function createRefundApplyingDetail(): ApplicationDetail {
  return {
    ...baseDetail('refundApplying', '退款申請中', 'refund-applying'),
    progress: refundProgress('尚未完成', '尚未完成'),
    paymentRows: paidRows(),
    paymentLines: [],
    sideCard: refundCard('退款申請中', '2026/06/06 10:30'),
    booth: emptyBooth('退款申請中，暫停攤位操作。'),
  };
}

function createRefundProcessingDetail(): ApplicationDetail {
  return {
    ...baseDetail('refundProcessing', '退款處理中', 'refund-processing'),
    progress: refundProgress('2026/06/10 10:55', '尚未完成'),
    paymentRows: paidRows(),
    paymentLines: [],
    sideCard: refundCard('退款處理中', '2026/06/06 10:30'),
    booth: emptyBooth('退款處理中，暫停攤位操作。'),
  };
}

function createRefundSuccessDetail(): ApplicationDetail {
  return {
    ...baseDetail('refundSuccess', '待選位', 'booth'),
    progress: [
      { label: '報名時間', value: '2026/06/01 14:30' },
      { label: '審核時間', value: '2026/06/02 15:30' },
      { label: '付款時間', value: '2026/06/03 16:45' },
      { label: '選擇攤位', value: '尚未完成' },
      { label: '報名完成', value: '尚未完成' },
    ],
    actionButton: { label: '申請退款', action: 'requestRefund' },
    sideCard: {
      type: 'booth',
      title: '攤位資訊',
      icon: 'bi-shop',
      rows: [],
      notice: '',
    },
    booth: {
      selected: false,
      rows: [],
      actionLabel: '選擇攤位',
      emptyTitle: '尚未選擇攤位',
      emptyText: '付款已完成，請選擇您的攤位位置',
    },
    dialog: {
      title: '退款申請已送出！',
      message: '您的退款申請已送出，主辦方將進行審核與處理。退款處理進度將於「我的報名紀錄」中查看。',
      confirmLabel: '確認',
    },
  };
}

function createPaymentDetail(): ApplicationDetail {
  return {
    ...baseDetail('payment', '待付款', 'payment'),
    progress: [
      { label: '報名時間', value: '2026/06/01 14:30' },
      { label: '審核時間', value: '2026/06/02 15:30' },
      { label: '付款時間', value: '尚未完成' },
      { label: '攤位完成時間', value: '尚未完成' },
      { label: '最終確認時間', value: '尚未完成' },
      { label: '保證金退還', value: '尚未完成' },
    ],
    paymentRows: [
      { label: '付款狀態', value: '待付款', highlight: true },
      { label: '付款期限', value: '2026/06/05 23:59', highlight: true },
      { label: '付款金額', value: '$1,200' },
    ],
    paymentLines: [],
    sideCard: {
      type: 'booth',
      title: '攤位資訊',
      icon: 'bi-shop',
      rows: [],
    },
    booth: emptyBooth('付款完成後才可選擇攤位'),
  };
}

/** 待審核狀態：審核尚未完成，因此付款與攤位資訊都以空狀態提示呈現。 */
function createReviewingDetail(): ApplicationDetail {
  return {
    ...baseDetail('reviewing', '待審核', 'reviewing'),
    progress: [
      { label: '報名時間', value: '2026/06/01 14:30' },
      { label: '審核時間', value: '尚未完成' },
      { label: '付款時間', value: '尚未完成' },
      { label: '攤位完成時間', value: '尚未完成' },
      { label: '最終確認時間', value: '尚未完成' },
      { label: '保證金退還', value: '尚未完成' },
    ],
    paymentRows: [],
    paymentLines: [],
    paymentEmptyTitle: '尚未產生付款資訊',
    paymentEmptyText: '審核通過後才會開放付款',
    sideCard: {
      type: 'booth',
      title: '攤位資訊',
      icon: 'bi-shop',
      rows: [],
    },
    booth: emptyBooth('付款完成後才可選擇攤位'),
  };
}

function createCompletedDetail(): ApplicationDetail {
  return {
    ...baseDetail('completed', '報名完成', 'completed'),
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
      rows: boothRows(),
    },
  };
}

/** 保證金已退還為正常流程結案狀態：活動結束且主辦已完成保證金退還。 */
function createDepositRefundedDetail(): ApplicationDetail {
  return {
    ...baseDetail('depositRefunded', '保證金已退還', 'deposit-refunded'),
    progress: [
      { label: '報名時間', value: '2026/06/01 14:30' },
      { label: '審核時間', value: '2026/06/02 15:30' },
      { label: '付款時間', value: '2026/06/03 16:45' },
      { label: '攤位完成時間', value: '2026/06/04 11:20' },
      { label: '最終確認時間', value: '2026/06/16 20:30' },
      { label: '保證金退還', value: '2026/06/25 10:30' },
    ],
    paymentRows: [
      ...paidRows(),
      { label: '保證金退還', value: '2026/06/25 10:30', highlight: true },
    ],
    sideCard: {
      type: 'booth',
      title: '攤位資訊',
      icon: 'bi-shop',
      rows: boothRows(),
      notice: '活動已完成結案，保證金已依原付款方式退還。',
    },
  };
}

function createCancelledDetail(): ApplicationDetail {
  return {
    ...baseDetail('cancelled', '已取消', 'cancelled'),
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
    },
    booth: emptyBooth('報名已取消，無法選擇攤位。'),
  };
}

function createRefundedDetail(): ApplicationDetail {
  return {
    ...baseDetail('refunded', '已退款', 'refunded'),
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
    sideCard: refundCard('已退款', '2026/06/09 10:20'),
  };
}

function baseDetail(status: ApplicationStatus, statusText: string, statusClass: string): ApplicationDetail {
  return {
    status,
    statusText,
    statusClass,
    title: '',
    applicationNo: '',
    dateRange: '',
    location: '',
    image: '',
    progress: [],
    applicationRows: applicationRows(),
    paymentRows: paidRows(),
    paymentLines: paymentLines(),
    booth: {
      selected: true,
      rows: boothRows(),
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

function refundProgress(reviewTime: string, refundTime: string): ProgressStep[] {
  return [
    { label: '報名時間', value: '2026/06/01 14:30' },
    { label: '審核時間', value: '2026/06/02 15:30' },
    { label: '付款時間', value: '2026/06/03 16:45' },
    { label: '退款申請時間', value: '2026/06/07 15:55' },
    { label: '退款審核時間', value: reviewTime },
    { label: '退款時間', value: refundTime },
  ];
}

function applicationRows(): DetailRow[] {
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

function paidRows(): DetailRow[] {
  return [
    { label: '付款狀態', value: '已付款' },
    { label: '付款方式', value: '信用卡' },
    { label: '付款金額', value: '$1,700' },
    { label: '付款時間', value: '2026/06/03 16:45' },
  ];
}

function paymentLines(): PaymentLine[] {
  return [
    { label: '2026/05/30 - 2*3米/2.7*3米/1.5米', amount: 650 },
    { label: '租借設備 - 電力', amount: 50 },
    { label: '保證金', amount: 1000 },
  ];
}

function boothRows(): DetailRow[] {
  return [
    { label: '攤位編號', value: 'A12' },
    { label: '區域', value: 'A區' },
    { label: '選位時間', value: '2026/06/04 11:20' },
    { label: '進場時間', value: '2026/06/15 12:30' },
  ];
}

function refundCard(refundStatus: string, requestTime: string) {
  return {
    type: 'refund' as const,
    title: '退款資訊',
    icon: 'bi-currency-dollar',
    rows: [
      { label: '退款狀態', value: refundStatus, highlight: true },
      { label: '退款金額', value: '$1,700', highlight: true },
      { label: '申請時間', value: requestTime },
      { label: '預計退款', value: '7 - 14 個工作天' },
      { label: '退款方式', value: '原付款方式退回' },
    ],
    notice: '主辦單位已收到您的退款申請，正在進行審核與處理，款項將依原付款方式退回。若有疑問，請聯繫主辦單位。',
  };
}

function emptyBooth(emptyText: string): BoothInfo {
  return {
    selected: false,
    rows: [],
    emptyTitle: '尚未選擇攤位',
    emptyText,
  };
}

function imagePath(imageNo: number): string {
  return `assets/images/market/cards/market-card-${imageNo.toString().padStart(2, '0')}.png`;
}
