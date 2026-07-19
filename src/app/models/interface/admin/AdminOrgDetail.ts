import { AdminUserLoginPage } from './AdminUserLoginLog';

/** 後端回傳的主辦方活動管理紀錄項目 */
export interface AdminOrgEventManagementDto {
  eventName: string;
  eventDate: string;
  eventStatus: string;
  registrationCount: string;
}

export interface AdminOrgEventPage {
  items: AdminOrgEventManagementDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** 後端回傳的主辦方詳細資料 */
export interface AdminOrgDetailDto {
  userId: number;
  userName: string;
  role: string;
  accountStatus: string;
  isGoogleBound: boolean;
  regAt: string;
  lastLoginAt: string | null;
  createdEventCount: number;
  ongoingEventCount: number;
  endedEventCount: number;
  organizerName: string;
  serviceHours: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  taxId: string;
  eventLogs: AdminOrgEventPage;
  loginLogs: AdminUserLoginPage;
}
