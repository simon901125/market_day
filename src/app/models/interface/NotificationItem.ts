/**通知中心項目 */
export interface NotificationItem {
  icon: string;
  iconClass: string;
  title: string;
  status: string;
  statusClass: string;
  date: string;
  unread: boolean;
  type: NotificationType;
}

export type NotificationType = string;
