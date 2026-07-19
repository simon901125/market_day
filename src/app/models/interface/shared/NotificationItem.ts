/**通知中心項目 */
export interface NotificationItem {
  /** 通知 id，標記已讀時需要 */
  id?: number;
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
