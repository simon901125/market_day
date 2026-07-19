export interface AdminUserSearchRequest {
  keyWord?: string | null;
  role?: string | null;
  status?: string | null;
  pageNumber: number;
  pageSize: number;
}

/** 後端回傳的使用者列表項目 */
export interface AdminUserListDto {
  id: number;
  role: string;
  name: string;
  status: string;
  email: string;
  regAt: string;
  lastLoginAt: string;
}

export interface AdminUserPage {
  items: AdminUserListDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
