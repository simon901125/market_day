import { AdminUserLoginPage } from './AdminUserLoginLog';

/** 後端回傳的攤主活動報名紀錄:報名攤位 */
export interface RegBooth {
  regDate: string;
  boothNo: string;
}

/** 後端回傳的攤主活動報名紀錄項目 */
export interface AdminVenderRegDto {
  eventName: string;
  regStatus: string;
  paymentStatus: string;
  regBooths: RegBooth[];
}

export interface AdminVenderRegPage {
  items: AdminVenderRegDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** 後端回傳的攤主詳細資料 */
export interface AdminVenderDetailDto {
  userId: number;
  userName: string;
  role: string;
  accountStatus: string;
  isGoogleBound: boolean;
  regAt: string;
  lastLoginAt: string | null;
  ongoingEventCount: number;
  endedEventCount: number;
  brandName: string;
  brandType: string;
  owner: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  eventRegLogs: AdminVenderRegPage;
  loginLogs: AdminUserLoginPage;
}
