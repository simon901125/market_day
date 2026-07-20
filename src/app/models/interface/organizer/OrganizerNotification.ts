export type OrganizerNotificationFilter =
  | '全部'
  | '未讀'
  | '報名相關'
  | '付款相關'
  | '活動異動'
  | '系統公告';

export interface OrganizerNotificationItem {
  id: number;
  category: string;
  type: string;
  targetType: string;
  targetId: number | null;
  title: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface OrganizerNotificationPage {
  items: OrganizerNotificationItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface OrganizerNotificationSearchResponse {
  unreadCount: number;
  notifications: OrganizerNotificationPage;
}
