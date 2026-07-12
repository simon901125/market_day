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
  /** 操作對象：攤主姓名或主辦方名稱 */
  target: string;
  /** 操作對象角色 */
  targetRole: '主辦方' | '攤主';
  /** 操作對象 Email 快照 */
  targetEmail: string;
  /** 操作內容 */
  details: string;
}
