export interface OrganizerEventDetailCategory {
  categoryId: number;
  categoryName: string;
  categorySlug: string;
}

export interface OrganizerEventDetailZone {
  zoneId: number;
  zoneName: string;
  stallCount: number;
  colorCode: string | null;
}

export interface OrganizerEventEquipmentItem {
  equipmentId: number;
  equipmentGroupKey: string | null;
  name: string;
  rentalFee: number;
  pricingUnit: string;
  unit: string | null;
  chargeType: 'FREE' | 'PAID';
  itemType: 'EQUIPMENT' | 'POWER';
  description: string | null;
  stockQuantity: number | null;
  perStallRentalLimit: number | null;
  rentalStatus: string;
  wattageLimit: number | null;
}

export interface OrganizerEventDetail {
  eventId: number;
  eventTitle: string;
  summary: string;
  description: string;
  categories: OrganizerEventDetailCategory[];
  coverImageUrl: string | null;
  schedule: {
    startAt: string;
    endAt: string;
    registrationStartAt: string;
    registrationEndAt: string;
    publicInfoAt: string | null;
    brandsPublicAt: string | null;
  };
  location: {
    locationName: string;
    city: string;
    district: string | null;
    address: string;
    trafficInfoMetro: string | null;
    trafficInfoBus: string | null;
    trafficInfoDriving: string | null;
  };
  booth: {
    maxBooths: number;
    stallWidth: number | null;
    stallLength: number | null;
    baseFee: number;
    depositAmount: number;
    mapImageUrl: string | null;
    zones: OrganizerEventDetailZone[];
  };
  equipment: { items: OrganizerEventEquipmentItem[] };
  workflowStatus: string;
  status: string;
  statusText: string;
  reviewNote: string | null;
  availableActions: string[];
  createdAt: string;
}
