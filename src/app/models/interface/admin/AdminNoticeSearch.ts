import { AdminDashboardNotice } from './AdminDashboardOverview';

export interface AdminNoticeSearchRequest {
  isOnlyUnread?: boolean | null;
  /** 後端 NotificationCategory 的 API 值，參考 NotificationCategory.apiCategoryMap 的 key */
  category?: string | null;
  pageNumber?: number | null;
  pageSize?: number | null;
}

export interface AdminNoticePage {
  items: AdminDashboardNotice[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
