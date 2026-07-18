export interface OrganizerEventSummary {
  eventId: number;
  eventTitle: string;
  coverImageUrl: string | null;
  createdAt: string;
  eventStartAt: string;
  eventEndAt: string;
  registrationStartAt: string;
  registrationEndAt: string;
  locationName: string;
  city: string;
  district: string | null;
  address: string;
  workflowStatus: string;
  status: string;
  statusText: string;
  capacity: number;
  registeredCount: number;
  pendingReviewCount: number;
  paidCount: number;
  selectedCount: number;
}

export interface OrganizerEventPage {
  items: OrganizerEventSummary[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface OrganizerEventSearchResponse {
  totalCount: number;
  events: OrganizerEventPage;
}
