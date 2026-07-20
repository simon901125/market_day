// 報名詳情頁首可操作按鈕設定。
export type OrganizerRegistrationDetailActionKey =
  | 'approve'
  | 'reject'
  | 'returnDeposit'
  | 'goPaymentManagement'
  | 'chooseBooth'
  | 'viewRefundInfo'
  | 'viewDepositInfo'
  | 'viewActivity'
  | 'viewBrand'
  | 'viewBoothMap';

export interface OrganizerRegistrationDetailAction {
  key: OrganizerRegistrationDetailActionKey;
  label: string;
  icon?: string;
  variant?: 'primary' | 'outline';
  disabled?: boolean;
  hint?: string;
}

export interface OrganizerRegistrationRejectReasonForm {
  reason: string;
  description: string;
}

// 報名詳情狀態紀錄時間軸項目。
export interface OrganizerRegistrationStatusRecordItem {
  label: string;
  value: string;
}

export interface OrganizerRegistrationInfoRow {
  label: string;
  content?: string;
  value: string;
}

export interface OrganizerRegistrationTableRow {
  cells: string[];
}

// 從報名管理列表帶入詳情頁的基礎資料。
export interface OrganizerRegistrationDetailSeed {
  id: number;
  activity: string;
  activityImage: string;
  activityTime: string;
  brandName: string;
  vendorName: string;
  brandType: string;
  registeredAt: string;
  status: string;
}

// 報名詳情頁完整顯示資料。
export interface OrganizerRegistrationDetail {
  id: number;
  status: string;
  registrationNo: string;
  activity: {
    eventId: number;
    name: string;
    image: string;
    date: string;
    startAt: string | null;
    endAt: string | null;
    status: string;
    location: string;
    address: string;
  };
  vendor: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  brand: {
    id: number | null;
    name: string;
    type: string;
    image: string;
    description: string;
  };
  registration: {
    period: string;
    boothSpec: string;
    boothZone: string;
    boothCategories: string;
    vehiclePlate: string;
    note: string;
    rentalEquipment: string;
  };
  fee: {
    boothFee: string;
    electricityFee: string;
    deposit: string;
    total: string;
  };
  payment: {
    status: string;
    method: string;
    transactionNo: string;
    amount: string;
    deadline: string;
  };
  boothAssignments: Array<{
    date: string;
    boothNo: string;
    zone: string;
    status: string;
  }>;
  feeRows: OrganizerRegistrationInfoRow[];
  freeEquipmentRows: OrganizerRegistrationTableRow[];
  rentalEquipmentRows: OrganizerRegistrationTableRow[];
  basicPowerRows: OrganizerRegistrationTableRow[];
  extraPowerRows: OrganizerRegistrationTableRow[];
  rentalEquipmentSubtotal: string;
  extraPowerSubtotal: string;
  refund?: {
    reason: string;
    description: string;
    requestedAt?: string;
    confirmedAt?: string;
    refundedAt?: string;
  };
  depositReturn?: {
    amount: string;
    method: string;
    returnedAt?: string;
  };
  times: {
    registeredAt: string;
    reviewedAt?: string;
    paidAt?: string;
    selectedAt?: string;
    finalConfirmedAt?: string;
    depositReturnedAt?: string;
    refundRequestedAt?: string;
    refundReviewedAt?: string;
    refundedAt?: string;
    cancelledAt?: string;
  };
  reason?: {
    title: string;
    subtitle: string;
    description: string;
  };
}
