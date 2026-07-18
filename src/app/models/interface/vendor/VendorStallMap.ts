/** 攤主選位地圖中的已選攤位摘要。 */
export interface VendorSelectedStall {
  selectedStallId: number;
  applyDate: string;
  stallNo: string;
  zoneName: string;
  width: number | null;
  length: number | null;
}

/** 攤主選位地圖的報名資料。 */
export interface VendorStallMapApplication {
  applicationNo: string;
  applicationStatus: string;
  vendorName: string;
  currentApplyDate: string;
  /** 後端目前以逗號分隔字串回傳報名日期。 */
  applyDates: string;
  applyDateCount: number;
  selectedStalls: VendorSelectedStall[];
  alreadyselectdate: string[];
}

/** 攤主選位地圖的活動摘要。 */
export interface VendorStallMapEvent {
  eventTitle: string;
  startAt: string;
  endAt: string;
  address: string;
}

/** 地圖上的單一攤位。 */
export interface VendorStallMapItem {
  stallId: number;
  zoneId: number;
  zoneName: string;
  stallNo: string;
  width: number | null;
  length: number | null;
  status: string;
  selectedApplicationId: number | null;
}

/** StallController.getVendorStallMap() 的 data 結構。 */
export interface VendorStallMap {
  application: VendorStallMapApplication;
  event: VendorStallMapEvent;
  stalls: VendorStallMapItem[];
}
