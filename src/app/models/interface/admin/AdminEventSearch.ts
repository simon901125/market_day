export interface AdminEventSearchRequest {
  keyword?: string | null;
  organizer?: string | null;
  status?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  pageNumber: number;
  pageSize: number;
}

/** 後端回傳的活動列表項目；`Date` 欄位名稱大寫是後端 AdminEventListDto 的實際命名，需照樣對應。 */
export interface AdminEventListDto {
  id: number;
  imgUrl: string;
  event: string;
  date: string;
  status: string;
  organizer: string;
  reviewTime: string;
}

export interface AdminEventPage {
  items: AdminEventListDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
