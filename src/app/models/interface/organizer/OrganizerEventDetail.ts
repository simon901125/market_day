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
  eventTitle: string | null;
  summary: string | null;
  description: string | null;
  categories: OrganizerEventDetailCategory[];
  coverImageUrl: string | null;
  schedule: {
    startAt: string | null;
    endAt: string | null;
    registrationStartAt: string | null;
    registrationEndAt: string | null;
    publicInfoAt: string | null;
    brandsPublicAt: string | null;
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
    mapImageUrl: string | null;
    zones: OrganizerEventDetailZone[];
  };
  equipment: {
    providesEquipmentRental: boolean | null;
    providesBasicPower: boolean | null;
    allowsExtraPower: boolean | null;
    items: OrganizerEventEquipmentItem[];
  };
  workflowStatus: string;
  status: string;
  statusText: string;
  reviewNote: string | null;
  availableActions: string[];
  createdAt: string;
}
