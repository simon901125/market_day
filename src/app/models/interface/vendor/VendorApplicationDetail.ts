import { MarketCardItem } from '../shared/MarketCardItem';

/** 報名詳細頁支援的報名狀態。 */
export type ApplicationStatus =
  | 'reviewing'
  | 'payment'
  | 'completed'
  | 'depositRefunded'
  | 'cancelled'
  | 'refunded'
  | 'refundApplying'
  | 'refundProcessing'
  | 'refundSuccess'
  | 'booth';

/** 報名詳細右側資訊卡類型。 */
export type SideCardType = 'booth' | 'refund';

/** 一般標籤與內容列，常用於報名內容、付款資訊、退款資訊。 */
export interface DetailRow {
  /** 欄位名稱。 */
  label: string;

  /** 欄位顯示值。 */
  value: string;

  /** 是否使用重點色顯示。 */
  highlight?: boolean;
}

/** 報名進度時間軸上的單一步驟。 */
export interface ProgressStep {
  /** 進度名稱，例如報名時間、付款時間。 */
  label: string;

  /** 進度時間或狀態文字。 */
  value: string;
}

/** 付款明細中的單一費用項目。 */
export interface PaymentLine {
  /** 費用名稱。 */
  label: string;

  /** 費用金額。 */
  amount: number;
}

/** 攤位資訊資料。 */
export interface BoothInfo {
  /** 是否已完成選位。 */
  selected: boolean;

  /** 已選位時顯示的攤位資料列。 */
  rows: DetailRow[];

  /** 主要操作按鈕文字，例如查看地圖、選擇攤位。 */
  actionLabel?: string;

  /** 尚未選位或不可操作時的提示標題。 */
  emptyTitle?: string;

  /** 尚未選位或不可操作時的提示說明。 */
  emptyText?: string;
}

/** 報名詳細第三張資訊卡，可依狀態顯示攤位資訊或退款資訊。 */
export interface SideCard {
  /** 資訊卡類型。 */
  type: SideCardType;

  /** 資訊卡標題。 */
  title: string;

  /** Bootstrap icon class，例如 bi-shop、bi-currency-dollar。 */
  icon: string;

  /** 資訊卡內的資料列。 */
  rows: DetailRow[];

  /** 額外提醒文字，例如退款申請提醒。 */
  notice?: string;
}

/** 頁面右上角的主要操作按鈕。 */
export interface DetailAction {
  /** 按鈕文字。 */
  label: string;

  /** 點擊後執行的動作識別。 */
  action: 'requestRefund';
}

/** 成功彈窗內容。 */
export interface DetailDialog {
  /** 彈窗標題。 */
  title: string;

  /** 彈窗說明文字。 */
  message: string;

  /** 確認按鈕文字。 */
  confirmLabel: string;
}

/** 報名詳細頁完整資料。 */
export interface ApplicationDetail {
  /** 報名狀態代碼。 */
  status: ApplicationStatus;

  /** 報名狀態顯示文字。 */
  statusText: string;

  /** 報名狀態樣式 class。 */
  statusClass: string;

  /** 活動名稱。 */
  title: string;

  /** 報名編號。 */
  applicationNo: string;

  /** 活動日期區間。 */
  dateRange: string;

  /** 活動地點。 */
  location: string;

  /** 活動圖片路徑。 */
  image: string;

  /** 報名進度資料。 */
  progress: ProgressStep[];

  /** 報名內容資料列。 */
  applicationRows: DetailRow[];

  /** 付款資訊資料列。 */
  paymentRows: DetailRow[];

  /** 付款明細資料列。 */
  paymentLines: PaymentLine[];

  /** 尚未產生付款資訊時的提示標題。 */
  paymentEmptyTitle?: string;

  /** 尚未產生付款資訊時的提示說明。 */
  paymentEmptyText?: string;

  /** 攤位資訊。 */
  booth: BoothInfo;

  /** 第三張資訊卡資料。 */
  sideCard: SideCard;

  /** 頁面右上角主要操作按鈕。 */
  actionButton?: DetailAction;

  /** 狀態需要顯示的成功彈窗資料。 */
  dialog?: DetailDialog;

  /** 活動是否正由主辦方申請下架；不影響攤主原本的報名狀態。 */
  marketUnpublishPending?: boolean;
}

/** GET /api/vendor/applications/{id} 中與活動下架狀態相關的欄位。 */
export interface VendorApplicationDetailApiResponse {
  event: {
    eventId: number;
    eventTitle: string;
    workflowStatus: string;
    unpublishRequested: boolean;
    unpublished: boolean;
    eventStatus: string;
  };
  [key: string]: unknown;
}

/** 清單進入詳細頁時，用報名編號覆蓋的活動摘要資料。 */
export interface ApplicationSummary {
  /** 活動名稱。 */
  title: string;

  /** 活動日期區間。 */
  dateRange: string;

  /** 活動地點。 */
  location: string;

  /** 活動圖片路徑。 */
  image: string;
}

/** 報名紀錄列表使用的狀態代碼。 */
export type ApplicationRecordStatus =
  | 'reviewing'
  | 'payment'
  | 'booth'
  | 'completed'
  | 'depositRefunded'
  | 'refundApplying'
  | 'refundProcessing'
  | 'refunded'
  | 'history';

/** 報名紀錄列表上方分頁。 */
export interface RecordTab {
  /** 分頁顯示文字。 */
  label: string;

  /** 分頁篩選值。 */
  value: ApplicationRecordStatus | 'all';
}

/** 報名紀錄列表每筆資料的操作按鈕。 */
export interface RecordAction {
  /** 按鈕文字。 */
  label: string;

  /** 按鈕樣式。 */
  style: 'primary' | 'outline';

  /** 有頁面導向時使用的路徑。 */
  link?: string;
}

/** 報名紀錄列表資料；detail 供詳細頁用報名編號直接取得完整內容。 */
export interface ApplicationRecord {
  /** 列表排序用流水號。 */
  id: number;

  /** 列表縮圖。 */
  image: string;

  /** 關聯的市集卡片資料，供 activity-detail 直接讀取。 */
  market: MarketCardItem;

  /** 市集名稱。 */
  marketName: string;

  /** 活動日期區間。 */
  eventDate: string;

  /** 活動地點。 */
  location: string;

  /** 報名編號。 */
  applicationNo: string;

  /** 列表狀態代碼。 */
  status: ApplicationRecordStatus;

  /** 列表狀態文字。 */
  statusText: string;

  /** 列表狀態樣式 class。 */
  statusClass: string;

  /** 列表操作按鈕。 */
  actions: RecordAction[];

  /** 詳細頁需要的完整資料。 */
  detail: ApplicationDetail;
}
