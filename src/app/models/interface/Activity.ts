/** 活動列表資訊 */
export interface Activity {
  /** 圖片 */
  image: string;
  /** 活動名字 */
  name: string;
  /** 日期 */
  date: string;
  /** 地點 */
  location: string;
  /** 活動狀態 */
  status: string;
  /** css-活動子狀態 */
  statusClass: string;
  /** 報名數量 */
  progress: string;
  /** 付款 */
  paid: string;
}