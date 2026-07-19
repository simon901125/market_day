export interface NewebPayPaymentForm {
  applicationId: number;
  applicationNo: string;
  paymentId: number;
  paymentNo: string;
  merchantOrderNo: string;
  gateway: string;
  merchantId: string;
  tradeInfo: string;
  tradeSha: string;
  version: string;
}

export interface VendorPaymentStatus {
  applicationId: number;
  applicationNo: string;
  reviewStatus: string;
  applicationPaymentStatus: string;
  cancelled: boolean;
  applicationAmount: number | null;
  paymentDueAt: string | null;
  paymentId: number | null;
  paymentNo: string | null;
  merchantOrderNo: string | null;
  paymentAmount: number | null;
  provider: string | null;
  providerTradeNo: string | null;
  paymentRecordStatus: string | null;
  paidAt: string | null;
  paymentCreatedAt: string | null;
}
