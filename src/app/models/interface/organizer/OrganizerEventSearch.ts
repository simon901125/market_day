export interface OrganizerEventSummary {
  eventId: number;
  eventTitle: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  eventStartAt: string | null;
  eventEndAt: string | null;
  registrationStartAt: string | null;
  registrationEndAt: string | null;
  locationName: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  workflowStatus: string;
  status: string;
  statusText: string;
  capacity: number | null;
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
