export interface VendorRefundRequest {
  applicationNo: string;
  reason: string;
}

export interface VendorRefundResult {
  refundId: number;
  refundNo: string;
  applicationId: number;
  applicationNo: string;
  paymentId: number;
  paymentNo: string;
  merchantOrderNo: string;
  providerTradeNo: string | null;
  refundAmount: number;
  depositAmount: number;
  refundMethod: string;
  refundStatus: string;
  reason: string;
  requestedAt: string;
}
