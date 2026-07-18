export interface OrganizerTaskSummary {
  pendingReviewCount: number;
  pendingRefundConfirmationCount: number;
  pendingStallSelectionCount: number;
}

export interface OrganizerApplicationSearchResponse {
  taskSummary: OrganizerTaskSummary;
  totalCount: number;
  applications: {
    items: unknown[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}
