/** 市集搜尋面板、列表元件與 VendorService 共用的 API 查詢條件。 */
export interface EventSearch {
  /** 關鍵字 */
  keyword?: string;
  /** 城市 */
  city?: string;
  /** 地區 */
  district?: string;
  /** 狀態 */
  status?: string;
  /** 活動開始日 */
  eventStartAt?: Date;
  /** 活動結束日 */
  eventEndAt?: Date;
  /** 頁數 */
  page?: number;
  /** 每頁筆數 */
  pageSize?: number;
}
