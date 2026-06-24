export interface OrganizerRegistrationAction {
  key?: string;
  label: string;
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  disabled?: boolean;
  hint?: string;
}

export interface OrganizerRegistrationRow {
  id: number;
  activity: string;
  activityImage: string;
  activityTime: string;
  brandName: string;
  vendorName: string;
  brandType: string;
  registeredAt: string;
  status: string;
  actionLabel?: string;
  actionVariant?: 'primary' | 'outline';
  actions?: OrganizerRegistrationAction[];
}
