export interface VendorMarketDetail {
  eventId: number;
  eventTitle: string;
  summary: string;
  description: string;
  locationName: string;
  city: string;
  district: string;
  address: string;
  notice: string | null;
  startAt: string;
  endAt: string;
  registrationStartAt: string | null;
  registrationEndAt: string | null;
  maxBooths: number;
  baseFee: number;
  coverImageUrl: string | null;
  mapImageUrl: string | null;
  categories: VendorMarketCategory[];
  organizerName: string | null;
  companyName: string | null;
  serviceDays: string | null;
  serviceStartTime: string | null;
  serviceEndTime: string | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  stallWidth: number | null;
  stallLength: number | null;
  stallHeight: number | null;
  registrationStatus: 'OPEN' | 'UPCOMING' | 'CLOSED';
  dailyAvailability: VendorMarketDailyAvailability[];
  equipments: VendorMarketEquipment[];
  trafficInfos: VendorMarketTrafficInfo[];
}

export interface VendorMarketCategory {
  id: number;
  name: string;
  slug: string;
}

export interface VendorMarketDailyAvailability {
  applyDate: string;
  totalStalls: number;
  remainingStalls: number;
}

export interface VendorMarketEquipment {
  eventEquipmentId: number;
  equipmentGroupKey: string | null;
  name: string;
  description: string | null;
  rentalFee: number;
  pricingUnit: string | null;
  unit: string | null;
  chargeType: string;
  itemType: string;
  stockQuantity: number | null;
  perStallRentalLimit: number | null;
  wattageLimit: number | null;
}

export interface VendorMarketTrafficInfo {
  id: number;
  trafficTitle: string;
  trafficDetails: string;
}
