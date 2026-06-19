/** 首頁最新通知資料 */
export interface DashboardNotification {
    /**
   * 通知類型
   * signup：報名相關
   * payment：付款相關
   * booth：攤位相關
   */
  type: 'signup' | 'payment' | 'booth';
  /** 通知內容 */
  text: string;
  /** 狀態文字 */
  status: string;
  /** 狀態樣式 class */
  statusClass: string;
  /** 通知時間 */
  date: string;
  /** 是否未讀 */
  unread?: boolean;
}