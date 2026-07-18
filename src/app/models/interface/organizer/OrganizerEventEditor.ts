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
  layoutFileName: string;
  layoutPreviewUrl: string;
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
