/** 主辦方後台活動管理表格資料 */
export interface OrganizerEventRow {
  /** 活動編號 */
  id: number;
  /** 活動名稱 */
  name: string;
  /** 活動縮圖 */
  nameImage: string;
  /** 活動日期區間 */
  date: string;
  /** 活動地點 */
  location: string;
  /** 活動狀態 */
  status: string;
  /** 報名人數 / 攤位上限 */
  signupProgress: string;
  /** 已付款筆數 */
  paidCount: string;
  /** 操作按鈕文字 */
  actionLabel: string;
}
