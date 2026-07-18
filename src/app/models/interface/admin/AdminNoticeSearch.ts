import { NotificationCategory } from '../../../modules/shared/dashboard/dashboard-notification/notification-category';
import { AdminDashboardNotice } from './AdminDashboardOverview';

export interface AdminNoticeSearchRequest {
  isOnlyUnread?: boolean | null;
  category?: NotificationCategory | null;
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
