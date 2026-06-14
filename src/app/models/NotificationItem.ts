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

export type NotificationType = '報名通知' | '收款通知' | '攤位通知' | '活動通知' |'報名相關' | '付款相關'| '活動異動' | '系統公告' | '主辦方' | '活動' | '系統' | '異常';
