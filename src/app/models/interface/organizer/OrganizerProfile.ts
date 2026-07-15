export interface OrganizerProfileSaveRequest {
  organizerName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyName: string;
  taxId: string;
  city: string;
  district: string;
  address: string;
  serviceDays: string;
  serviceStartTime: string;
  serviceEndTime: string;
}

type Nullable<T> = {
  [Key in keyof T]: T[Key] | null;
};

export type OrganizerProfile = Nullable<OrganizerProfileSaveRequest>;

export interface OrganizerProfileForm
  extends Omit<OrganizerProfileSaveRequest, 'serviceDays'> {
  serviceDays: string[];
}
