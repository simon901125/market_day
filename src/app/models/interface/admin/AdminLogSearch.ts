export interface AdminLogsSearchRequest {
  keyWord?: string | null;
  operationType?: string | null;
  targetType?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  pageNumber: number;
  pageSize: number;
}

/** 後端回傳的操作紀錄列表項目 */
export interface AdminOperationLogDto {
  id: number;
  operator: string;
  operationType: string;
  targetType: string;
  targetName: string;
  /** 操作對象 Email；對象為系統/活動等非人員時為 null */
  email: string | null;
  createdAt: string;
  content: string;
}

export interface AdminLogPage {
  items: AdminOperationLogDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
