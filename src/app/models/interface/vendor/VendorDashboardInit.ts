export interface VendorDashboardInit {
  needsProfile: boolean;
  guideMessage: string | null;
  name: string | null;
  pendingReviewCount: number;
  pendingPaymentCount: number;
  pendingStallSelectionCount: number;
  notifications: VendorDashboardNotification[];
}

export interface VendorDashboardNotification {
  id: number;
  category: string;
  type: string;
  targetType: string;
  targetId: number | null;
  title: string;
  content: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
