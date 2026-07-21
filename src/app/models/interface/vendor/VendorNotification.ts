import { VendorDashboardNotification } from './VendorDashboardInit';

export type VendorNotificationFilter =
  | '全部'
  | '未讀'
  | '報名審核'
  | '付款相關'
  | '攤位分配'
  | '活動異動'
  | '系統通知';

export interface VendorNotificationPage {
  items: VendorDashboardNotification[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface VendorNotificationSearchResponse {
  unreadCount: number;
  notifications: VendorNotificationPage;
}
