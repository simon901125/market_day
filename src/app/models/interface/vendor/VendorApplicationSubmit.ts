/** POST /api/vendor/applications 的報名資料。日期格式須為 yyyy-MM-dd。 */
export interface VendorApplicationSubmitRequest {
  eventId: number;
  applyDates: string[];
  vehicleNo?: string | null;
  applicantNote?: string | null;
  equipmentRentals?: VendorApplicationEquipmentRentalRequest[];
}

export interface VendorApplicationEquipmentRentalRequest {
  eventEquipmentId: number;
  quantity?: number;
  rentalUnits?: number;
  appliances?: VendorApplicationApplianceRequest[];
}

export interface VendorApplicationApplianceRequest {
  applianceName: string;
  wattage: number;
}

export interface VendorApplicationSubmitResponse {
  applicationId: number;
  applicationNo: string;
  eventId: number;
  eventTitle: string;
  applicationStatus: string;
  reviewStatus: string;
  paymentStatus: string;
  applyDates: string[];
  applicationFee: number;
  equipmentTotal: number;
  depositAmount: number;
  totalAmount: number;
  paymentDueAt: string;
  equipmentRentals: VendorApplicationEquipmentRentalResponse[];
}

export interface VendorApplicationEquipmentRentalResponse {
  eventEquipmentId: number;
  equipmentName: string;
  rentalFee: number;
  pricingUnit: string | null;
  unit: string | null;
  quantity: number;
  rentalUnits: number;
  subtotal: number;
}
