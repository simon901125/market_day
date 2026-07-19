export interface AdminEventCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AdminEventBoothZone {
  name: string;
  qty: number;
}

export interface AdminEventStatusLog {
  dateTime: string;
  status: string;
  description: string;
  /** 操作人員角色，後端 Role 的 API 值：admin/organizer/vender */
  operatorRole: string;
  operator: string;
}

export interface AdminEventStatusLogPage {
  items: AdminEventStatusLog[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface AdminEventDetailDto {
  eventId: number;
  coverImg: string;
  eventName: string;
  locationName: string;
  addr: string;
  eventStatus: string;
  categories: AdminEventCategory[];
  description: string;
  registrationStartTime: string;
  registrationEndTime: string;
  finalListCfmTime: string | null;
  eventTime: string;
  organizerName: string;
  taxId: string;
  serviceHours: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  contactAddr: string;
  mrt: string;
  bus: string;
  driving: string;
  boothSpec: string;
  boothCount: number;
  boothPrice: number;
  boothZones: AdminEventBoothZone[];
  boothLayoutImage: string;
  /** 下架申請id，僅當 eventStatus 為下架申請中時有值 */
  unpublishRequestId: number | null;
  /** 下架申請原因，僅當 eventStatus 為下架申請中時有值 */
  unpublishReason: string | null;
  /** 下架申請時間，僅當 eventStatus 為下架申請中時有值 */
  unpublishRequestedAt: string | null;
  logs: AdminEventStatusLogPage;
}
