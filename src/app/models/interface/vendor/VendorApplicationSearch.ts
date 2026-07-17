/** 攤主報名紀錄搜尋條件。 */
export interface VendorApplicationSearchParams {
  eventTitle?: string;
  status?: string;
  eventStartAt?: string;
  eventEndAt?: string;
  page?: number;
  pageSize?: number;
}

/** 報名紀錄清單單筆摘要。 */
export interface VendorApplicationSummary {
  applicationId: number;
  applicationNo: string;
  appliedAt: string;
  applicationStatus: string;
  eventId: number;
  eventImageUrl: string | null;
  eventTitle: string;
  eventDate: string;
  eventStartAt: string;
  eventEndAt: string;
  location: string;
}

/** 後端共用分頁結構。 */
export interface VendorApplicationPage {
  items: VendorApplicationSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** StallController.searchVendorApplications() 的 data 內容。 */
export interface VendorApplicationSearchResult {
  totalCount: number;
  applications: VendorApplicationPage;
}
