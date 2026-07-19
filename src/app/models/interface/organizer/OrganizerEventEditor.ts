export interface EventForm {
  name: string;
  coverFileName: string;
  coverPreviewUrl: string;
  categories: string[];
  description: string;
  introduction: string;
}

export interface EventTimeForm {
  eventStartDate: string;
  eventEndDate: string;
  eventStartTime: string;
  eventEndTime: string;
  registrationStartDate: string;
  registrationStartTime: string;
  registrationEndDate: string;
  registrationEndTime: string;
  metro: string;
  bus: string;
  driving: string;
}

export interface VenueBoothForm {
  city: string;
  district: string;
  address: string;
  venueName: string;
  boothWidth: number | null;
  boothLength: number | null;
  totalBooths: number | null;
  boothPrice: number | null;
  depositAmount: number | null;
  layoutFileName: string;
  layoutPreviewUrl: string;
}

export interface OrganizerEventSaveRequest {
  eventId: number | null;
  eventTitle: string | null;
  summary: string | null;
  description: string | null;
  categoryIds: number[];
  schedule: {
    startAt: string | null;
    endAt: string | null;
    registrationStartAt: string | null;
    registrationEndAt: string | null;
  };
  location: {
    locationName: string | null;
    city: string | null;
    district: string | null;
    address: string | null;
    trafficInfoMetro: string | null;
    trafficInfoBus: string | null;
    trafficInfoDriving: string | null;
  };
  booth: {
    maxBooths: number | null;
    stallWidth: number | null;
    stallLength: number | null;
    baseFee: number | null;
    depositAmount: number | null;
    zones: Array<{
      zoneId: number | null;
      zoneName: string;
      stallCount: number;
      colorCode: string;
    }>;
  };
  equipment: {
    providesEquipmentRental: boolean | null;
    providesBasicPower: boolean | null;
    allowsExtraPower: boolean | null;
    items: OrganizerEventSaveEquipmentItem[];
  };
}

export interface OrganizerEventSaveEquipmentItem {
  equipmentId: number | null;
  equipmentGroupKey: string | null;
  name: string;
  rentalFee: number;
  pricingUnit: 'DAY';
  unit: string | null;
  chargeType: 'FREE' | 'PAID';
  itemType: 'EQUIPMENT' | 'POWER';
  description: string | null;
  stockQuantity: number | null;
  perStallRentalLimit: number | null;
  rentalStatus: 'ACTIVE';
  wattageLimit: number | null;
}

export interface StoredEventImage {
  purpose: 'EVENT_COVER' | 'EVENT_MAP';
  productId: null;
  eventId: number;
  imageUrl: string;
  contentType: string;
  fileSize: number;
}

export interface OrganizerEventSubmitReviewResponse {
  eventId: number;
  workflowStatus: string;
  status: string;
  statusText: string;
  availableActions: string[];
  missingFields: string[];
}

export interface OrganizerEventWithdrawResponse {
  eventId: number;
  workflowStatus: string;
  status: string;
  statusText: string;
  availableActions: string[];
}

export interface OrganizerEventPublishResponse {
  eventId: number;
  workflowStatus: string;
  status: string;
  statusText: string;
  publicInfoAt: string | null;
  availableActions: string[];
  expectedStallCount: number | null;
  actualStallCount: number;
  missingFields: string[];
}

export interface OrganizerEventUnpublishRequestResponse {
  eventId: number;
  unpublishRequestId: number;
  workflowStatus: 'UNPUBLISH_REQUESTED';
  status: string;
  statusText: string;
  reason: string;
  requestedAt: string;
  availableActions: string[];
}

export interface BoothZone {
  name: string;
  color: string;
  count: number;
}

export interface FormStep {
  title: string;
  description: string;
}

export interface EventEquipment {
  name: string;
  specification: string;
  unit: string;
  freeQuantity: number;
  rentable: boolean;
  rentalPrice: number | null;
  rentalLimit: number | null;
  dailyRentalQuantity: number | null;
}

export interface EventPowerPlan {
  voltage: string;
  wattage: number | null;
  fee: number | null;
  description: string;
}

export interface EventEquipmentDraft extends EventEquipment {}

export interface EventPowerPlanDraft extends EventPowerPlan {}

export interface StatusAction {
  key: 'delete' | 'edit' | 'submit' | 'withdraw' | 'resubmit' | 'publish' | 'unpublish' | 'view';
  label: string;
  variant: 'primary' | 'outline' | 'danger';
}
