// 報名管理列表單筆操作按鈕設定。
export interface OrganizerRegistrationAction {
  key?: string;
  label: string;
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  disabled?: boolean;
  hint?: string;
}

// 報名管理列表每一列需要顯示的資料。
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
