/** 攤主報名詳情 API 中的報名基本資料。 */
export interface VendorApplicationApiInfo {
  /** 報名資料庫主鍵，用於詳情 API path variable。 */
  applicationId: number;
  /** 顯示與付款、選位流程使用的報名編號。 */
  applicationNo: string;
  /** 後端解析後的中文報名狀態。 */
  applicationStatus: string;
}

/** 報名詳情 API 中的活動摘要。 */
export interface VendorApplicationApiEvent {
  /** 活動資料庫主鍵。 */
  eventId: number;
  /** 活動封面圖片 URL，可能尚未上傳。 */
  eventCoverImageUrl: string | null;
  /** 活動名稱。 */
  eventTitle: string;
  /** 依目前時間計算的活動狀態。 */
  eventStatus: string;
  /** 活動上／下架工作流程狀態。 */
  workflowStatus?: string;
  /** 活動是否正在申請下架。 */
  unpublishRequested?: boolean;
  /** 活動是否已下架。 */
  unpublished?: boolean;
  /** 報名階段的輔助說明。 */
  statusNote: string | null;
  /** 後端已格式化的活動日期區間。 */
  eventTime: string;
  /** 活動開始日期時間。 */
  eventStartAt: string;
  /** 活動結束日期時間。 */
  eventEndAt: string;
  /** 縣市、地區與場地名稱組合後的地點。 */
  locationName: string;
  /** 縣市、地區與詳細地址組合後的地址。 */
  address: string;
}

/** 攤主在報名時送出的報名內容。 */
export interface VendorApplicationApiContent {
  /** 報名場次與每日時間的格式化文字。 */
  registrationPeriods: string | null;
  /** 攤位寬度。 */
  width: number | null;
  /** 攤位長度。 */
  length: number | null;
  /** 已選攤位的分區名稱。 */
  stallZone: string | null;
  /** 報名攤位對應的品牌類別。 */
  stallCategory: string | null;
  /** 攤主登記的車牌號碼。 */
  vehicleNo: string | null;
  /** 攤主報名備註。 */
  applicantNote: string | null;
  /** 主辦方審核備註。 */
  reviewNote: string | null;
  /** 主辦方審核備註的詳細說明。 */
  reviewNoteDetail: string | null;
}

/** 單一報名日期的攤位分配結果。 */
export interface VendorApplicationApiStall {
  /** 報名日期。 */
  applyDate: string;
  /** 已選攤位編號，未選位時為 null。 */
  stallNo: string | null;
  /** 已選攤位分區，未選位時為 null。 */
  zoneName: string | null;
  /** 當日攤位是否已選擇的顯示文字。 */
  selectionStatus: string;
}

/** 報名的付款結果。 */
export interface VendorApplicationApiFee {
  /** 付款狀態顯示文字。 */
  paymentStatus: string | null;
  /** 付款服務商或付款方式。 */
  paymentMethod: string | null;
  /** 系統付款編號。 */
  paymentNo: string | null;
  /** 金流服務商交易編號。 */
  providerTradeNo: string | null;
  /** 付款完成時間。 */
  paidAt: string | null;
  /** 應付或實付總金額。 */
  paymentAmount: number | null;
}

/** 報名的退款處理結果。 */
export interface VendorApplicationApiRefund {
  /** 後端退款狀態代碼。 */
  refundStatus: string | null;
  /** 退款狀態中文顯示文字。 */
  refundStatusText: string | null;
  /** 退款使用的原付款方式。 */
  refundMethod: string | null;
  /** 系統退款編號。 */
  refundNo: string | null;
  /** 退款金額。 */
  refundAmount: number | null;
  /** 退款完成時間。 */
  refundedAt: string | null;
}

/** 費用明細表的單一列。 */
export interface VendorApplicationApiFeeDetail {
  /** 費用項目名稱。 */
  item: string;
  /** 費用的場次、數量或設備說明。 */
  content: string | null;
  /** 該項費用金額。 */
  amount: number | null;
}

/** 基本或付費租借設備。 */
export interface VendorApplicationApiEquipment {
  /** 設備名稱。 */
  equipmentName: string;
  /** 設備規格說明。 */
  specification: string | null;
  /** 租借數量。 */
  quantity: number;
  /** 數量單位。 */
  unit: string;
  /** 單價；後端未回傳時可缺省。 */
  unitPrice?: number | null;
  /** 設備小計。 */
  subtotal: number;
  /** 租借天數等小計說明。 */
  subtotalContent?: string | null;
  /** 設備總金額。 */
  total?: number | null;
}

/** 基本或額外用電申請。 */
export interface VendorApplicationApiPower {
  /** 電力規格說明。 */
  powerSpecification: string;
  /** 功率上限或申請總功率。 */
  wattage: number | null;
  /** 用電單價。 */
  unitPrice: number | null;
  /** 計價單位。 */
  unit?: string | null;
  /** 用電小計。 */
  subtotal: number;
  /** 申請天數等小計說明。 */
  subtotalContent?: string | null;
  /** 用電總金額。 */
  total?: number | null;
}

/** 報名狀態流程的單一步驟。 */
export interface VendorApplicationApiStatusStep {
  /** 後端狀態步驟識別碼。 */
  key: string;
  /** 狀態步驟標題。 */
  label: string;
  /** 狀態值，尚未到達該步驟時為 null。 */
  value: string | null;
  /** 狀態變更時間。 */
  createdAt: string | null;
}

/** 攤主帳號與聯絡資料。 */
export interface VendorApplicationApiVendor {
  /** 攤主姓名。 */
  vendorOwnerName: string | null;
  /** 攤主聯絡電話。 */
  vendorPhone: string | null;
  /** 攤主聯絡 Email。 */
  vendorEmail: string | null;
  /** 攤主聯絡地址。 */
  address: string | null;
}

/** 報名時快照的品牌資料。 */
export interface VendorApplicationApiBrand {
  /** 品牌名稱。 */
  brandName: string | null;
  /** 品牌類別名稱。 */
  categoryName: string | null;
  /** 品牌介紹。 */
  brandDescription: string | null;
}

/** 依免費／付費與設備／用電分組的租借資料。 */
export interface VendorApplicationApiEquipmentGroups {
  /** 免費基本設備。 */
  freeEquipments: VendorApplicationApiEquipment[];
  /** 免費基本用電。 */
  freeBasicPower: VendorApplicationApiPower[];
  /** 付費租借設備。 */
  rentalEquipments: VendorApplicationApiEquipment[];
  /** 付費額外用電。 */
  extraPower: VendorApplicationApiPower[];
}

/** StallController.getVendorApplicationDetail() 的 data 完整結構。 */
export interface VendorApplicationApiDetail {
  /** 報名基本資料。 */
  application: VendorApplicationApiInfo;
  /** 報名關聯的活動摘要。 */
  event: VendorApplicationApiEvent;
  /** 攤主聯絡資料。 */
  vendor: VendorApplicationApiVendor;
  /** 品牌快照資料。 */
  brand: VendorApplicationApiBrand;
  /** 報名內容與審核備註。 */
  applicationdetail: VendorApplicationApiContent;
  /** 各報名日期的攤位分配。 */
  stall: VendorApplicationApiStall[];
  /** 付款資料。 */
  fee: VendorApplicationApiFee;
  /** 退款資料。 */
  refund: VendorApplicationApiRefund;
  /** 費用明細。 */
  feedetail: VendorApplicationApiFeeDetail[];
  /** 設備與用電分組明細。 */
  equipmentRentals: VendorApplicationApiEquipmentGroups;
  /** 報名狀態流程。 */
  status: VendorApplicationApiStatusStep[];
}
