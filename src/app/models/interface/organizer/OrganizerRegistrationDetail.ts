// 報名詳情頁首可操作按鈕設定。
export type OrganizerRegistrationDetailActionKey =
  | 'approve'
  | 'reject'
  | 'returnDeposit'
  | 'goPaymentManagement';

export interface OrganizerRegistrationDetailAction {
  key: OrganizerRegistrationDetailActionKey;
  label: string;
  icon?: string;
  variant?: 'primary' | 'outline';
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
    name: string;
    image: string;
    date: string;
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
    name: string;
    type: string;
    image: string;
    description: string;
  };
  registration: {
    period: string;
    boothSpec: string;
    boothCategories: string;
    rentalEquipment: string;
  };
  fee: {
    boothFee: string;
    electricityFee: string;
    deposit: string;
    total: string;
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
