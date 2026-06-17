/** 管理員-操作紀錄列表項目 */
export interface AdminLogItem {
  /** 操作 id */
  id: number;
  /** 操作時間 */
  createdAt: string;
  /** 操作人員 */
  operator: string;
  /** 操作類型 */
  actionType: string;
  /** 操作對象 */
  target: string;
  /** 操作內容 */
  details: string;
}
