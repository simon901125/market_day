/** 後端回傳的使用者登入紀錄項目 */
export interface AdminUserLoginDto {
  loginTime: string;
  loginMethod: string;
  loginStatus: string;
}

export interface AdminUserLoginPage {
  items: AdminUserLoginDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
