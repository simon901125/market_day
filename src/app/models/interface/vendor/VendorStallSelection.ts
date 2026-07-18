/** 單一活動日期的選位資料。 */
export interface VendorStallSelectionItem {
  applyDate: string;
  stallNo: string;
}

/** StallController.selectEventStall() 接收的 request body。 */
export interface VendorStallSelectionRequest {
  applicationNo: string;
  selections: VendorStallSelectionItem[];
}

/** StallController.selectEventStall() 回傳的 data 結構。 */
export interface VendorStallSelectionResult {
  applicationNo: string;
  /** 相容後端保留的第一筆攤位編號欄位。 */
  stallNo: string | null;
  selections: VendorStallSelectionItem[];
}
