/** 攤位區域分佈（A 區、舞台區、休息區等） */
export interface AdminMarketBoothZone {
  /** 區域名稱，例如 'A 區'、'舞台區' */
  name: string;
  /** 攤位數量（舞台區、休息區等功能性區域可省略） */
  count?: number;
}

/** 攤位資訊 */
export interface AdminMarketBoothInfo {
  /** 攤位規格，例如 '3m x 3m x 2.5m' */
  size: string;
  /** 攤位總容納數 */
  totalCount: number;
  /** 每攤價格（元） */
  pricePerBooth: number;
  /** 各區域攤位分配 */
  zones: AdminMarketBoothZone[];
  /** 攤位配置圖 URL */
  layoutImageUrl: string;
}

/** 主辦方資料 */
export interface AdminMarketOrganizerInfo {
  /** 主辦方名稱 */
  name: string;
  /** 聯絡電話 */
  phone: string;
  /** Email */
  email: string;
  /** 地址 */
  address: string;
  /** 統一編號 */
  taxId: string;
  /** 營業時間，例如 '週一 ～ 週五 09:00 ～ 18:00' */
  businessHours: string;
}

/** 時間流程（活動舉辦前的關鍵日期節點） */
export interface AdminMarketSchedule {
  /** 攤販報名開始時間 */
  applyStartAt: string;
  /** 攤販報名截止時間 */
  applyEndAt: string;
  /** 審核結果通知截止時間 */
  noticeDeadlineAt: string;
}

/** 交通方式 */
export interface AdminMarketTransportation {
  /** 捷運指引 */
  mrt: string;
  /** 公車路線 */
  bus: string;
  /** 開車 / 停車資訊 */
  car: string;
}

/** 狀態記錄（每次狀態變更的歷程） */
export interface AdminMarketStatusRecord {
  /** 發生時間 */
  createdAt: string;
  /** 狀態標籤，對應 ActivityStatus 的值 */
  status: string;
  /** 說明文字 */
  description: string;
  /** 操作人，例如 '系統' 或 '管理員 Admin' */
  operator: string;
}

/** 管理員 - 活動詳細資料（對應 admin-dashboard-market-detail 頁面） */
export interface AdminMarketDetail {
  /** 活動 id */
  id: number;
  /** 活動編號，例如 EVT202506001 */
  activityCode: string;
  /** 活動名稱 */
  name: string;
  /** 主視覺圖片 URL */
  image: string;
  /** 活動狀態，對應 ActivityStatus 的值 */
  status: string;
  /** 活動類型標籤，例如 ['主題市集', '生活選物', '精品市場'] */
  types: string[];
  /** 活動介紹 */
  description: string;
  /** 活動開始日期，格式 YYYY/MM/DD */
  startDate: string;
  /** 活動結束日期，格式 YYYY/MM/DD */
  endDate: string;
  /** 每日開放時間，格式 HH:mm */
  openTime: string;
  /** 每日結束時間，格式 HH:mm */
  closeTime: string;
  /** 活動地點 */
  location: string;
  /** 主辦方資料 */
  organizer: AdminMarketOrganizerInfo;
  /** 時間流程 */
  schedule: AdminMarketSchedule;
  /** 交通方式 */
  transportation: AdminMarketTransportation;
  /** 攤位資訊 */
  boothInfo: AdminMarketBoothInfo;
  /** 狀態記錄（由新至舊排列） */
  statusHistory: AdminMarketStatusRecord[];
}
