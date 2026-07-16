/** 後端回傳的報名開放狀態。 */
export type MarketRegistrationStatus = 'OPEN' | 'UPCOMING' | 'CLOSED';

/** 市集搜尋 API 回傳的單筆活動摘要。 */
export interface VendorMarketSearchItem {
  eventId: number;
  eventTitle: string;
  summary: string;
  locationName: string;
  city: string;
  district: string;
  address: string;
  maxBooths: number;
  /** 開始時間 */
  startAt: string;
  /** 結束結束 */
  endAt: string;
  registrationStartAt: string | null;
  registrationEndAt: string | null;
  baseFee: number;
  trafficTitle: string | null;
  trafficDetail: string | null;
  categoryName: string | null;
  organizerName: string | null;
  imageUrl: string | null;
  registrationStatus: MarketRegistrationStatus;
}

/** 市集搜尋 API 的分頁資料。 */
export interface VendorMarketSearchPage {
  items: VendorMarketSearchItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** 市集搜尋 API 的 data 欄位。 */
export interface VendorMarketSearchResponse {
  markets: VendorMarketSearchPage;
}
