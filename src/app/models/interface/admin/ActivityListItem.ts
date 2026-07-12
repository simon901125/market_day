/** 管理員-活動管理列表項目 */
export interface ActivityListItem {
  /** 活動 id */
  id: number;
  /** 縮圖 */
  image: string;
  /** 活動名稱 */
  name: string;
  /** 主辦方 */
  organizer: string;
  /** 活動開始日期 */
  startDate: string;
  /** 活動結束日期 */
  endDate: string;
  /** 活動狀態，對應 ActivityStatus 的值 */
  status: string;
  /** 最近一次送審時間（管理列表使用） */
  submittedAt?: string;
  /** 建立時間（舊詳細頁資料相容欄位） */
  createdAt?: string;
}
