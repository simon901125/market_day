import { OrganizerPage } from './OrganizerOperations';

export interface OrganizerPaymentSummary {
  applicationId: number;
  eventCoverImageUrl: string | null;
  eventTitle: string;
  brandName: string | null;
  vendorName: string | null;
  applicationStatus: string;
  paymentAmount: number | string | null;
  depositAmount: number | string | null;
  paymentTime: string | null;
  paymentStatus: string;
}

export interface OrganizerPaymentSearchResponse {
  payments: OrganizerPage<OrganizerPaymentSummary>;
}

export interface OrganizerPaymentStatusRecord {
  key: string;
  label: string;
  value: string | null;
  createdAt: string | null;
}

export interface OrganizerPaymentFeeDetail {
  item: string;
  content: string | null;
  amount: number | string | null;
}

export interface OrganizerPaymentEquipment {
  equipmentName: string | null;
  specification: string | null;
  quantity: number | string | null;
  unit?: string | null;
  unitPrice?: number | string | null;
  rentalDays?: number | string | null;
  subtotal?: number | string | null;
}

export interface OrganizerPaymentPower {
  powerSpecification: string | null;
  wattage: number | string | null;
  unitPrice?: number | string | null;
  rentalDays?: number | string | null;
  subtotal?: number | string | null;
}

export interface OrganizerPaymentDetailResponse {
  event: {
    eventId: number;
    eventCoverImageUrl: string | null;
    eventTitle: string;
    eventStatus: string;
    eventDate: string;
    eventTime: string;
    locationName: string | null;
    address: string | null;
  };
  application: {
    applicationId: number;
    applicationStatus: string;
    paymentStatus: string;
    applicationNo: string;
    paymentNo: string | null;
  };
  statusRecords: OrganizerPaymentStatusRecord[];
  vendor: {
    vendorName: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  brand: {
    brandName: string | null;
    avatarImageUrl: string | null;
    category: string | null;
    introduction: string | null;
  };
  payment: {
    paymentMethod: string | null;
    paymentPlatform: string | null;
    paymentTradeNo: string | null;
    paidAt: string | null;
  };
  feeDetails: OrganizerPaymentFeeDetail[];
  refund: {
    refundStatus: string;
    refundMethod: string | null;
    paymentPlatform: string | null;
    refundTradeNo: string;
    refundedAt: string | null;
  } | null;
  refundDetails: OrganizerPaymentFeeDetail[] | null;
  basicEquipments: OrganizerPaymentEquipment[];
  basicPower: OrganizerPaymentPower[];
  rentalEquipments: OrganizerPaymentEquipment[];
  extraPower: OrganizerPaymentPower[];
}

export interface OrganizerRefundResponse {
  refundId: number;
  refundNo: string;
  refundAmount: number;
  refundStatus: string;
  refundedAt: string | null;
  applicationId: number;
  applicationNo: string;
  paymentId: number;
  paymentNo: string;
  merchantOrderNo: string;
  providerTradeNo: string;
  newebpayResult: unknown;
}
