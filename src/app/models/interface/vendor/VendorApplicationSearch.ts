/** 攤主報名紀錄搜尋條件。 */
export interface VendorApplicationSearchParams {
  /** 活動名稱關鍵字。 */
  eventTitle?: string;
  /** 報名狀態代碼或中文狀態。 */
  status?: string;
  /** 活動開始日篩選值，格式為 yyyy-MM-dd。 */
  eventStartAt?: string;
  /** 活動結束日篩選值，格式為 yyyy-MM-dd。 */
  eventEndAt?: string;
  /** 目前頁碼，從 1 開始。 */
  page?: number;
  /** 每頁筆數。 */
  pageSize?: number;
}

/** 報名紀錄清單單筆摘要。 */
export interface VendorApplicationSummary {
  /** 報名資料庫主鍵。 */
  applicationId: number;
  /** 報名編號。 */
  applicationNo: string;
  /** 報名建立時間。 */
  appliedAt: string;
  /** 後端解析後的中文報名狀態。 */
  applicationStatus: string;
  /** 活動資料庫主鍵。 */
  eventId: number;
  /** 活動封面圖片 URL。 */
  eventImageUrl: string | null;
  /** 活動名稱。 */
  eventTitle: string;
  /** 後端已格式化的活動日期區間。 */
  eventDate: string;
  /** 活動開始日期時間。 */
  eventStartAt: string;
  /** 活動結束日期時間。 */
  eventEndAt: string;
  /** 活動縣市、地區與場地名稱。 */
  location: string;
}

/** 後端共用分頁結構。 */
export interface VendorApplicationPage {
  /** 目前頁報名紀錄。 */
  items: VendorApplicationSummary[];
  /** 目前頁碼。 */
  page: number;
  /** 每頁筆數。 */
  pageSize: number;
  /** 符合條件的總筆數。 */
  totalItems: number;
  /** 總頁數。 */
  totalPages: number;
  /** 是否有上一頁。 */
  hasPrevious: boolean;
  /** 是否有下一頁。 */
  hasNext: boolean;
}

/** StallController.searchVendorApplications() 的 data 內容。 */
export interface VendorApplicationSearchResult {
  /** 符合條件的報名總筆數。 */
  totalCount: number;
  /** 報名紀錄分頁資料。 */
  applications: VendorApplicationPage;
}
