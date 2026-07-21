export interface PageResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface UserCategoryApi {
  id: number;
  name: string;
  slug: string;
}

export interface UserMarketSearchParams {
  eventType?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  city?: string;
  eventStatus?: string;
  categoryNames?: string;
  page?: number;
  pageSize?: number;
}

export interface UserMarketCardApi {
  id: number;
  title: string;
  summary: string | null;
  locationName: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  startDate: string | null;
  startDayOfWeek: string | null;
  endDate: string | null;
  endDayOfWeek: string | null;
  coverImageUrl: string | null;
  categories: UserCategoryApi[];
  eventStatus: string;
}

export interface UserMarketDetailApi extends UserMarketCardApi {
  startTime: string | null;
  endTime: string | null;
  durationDays: number;
  description: string | null;
  organizer: UserMarketOrganizerApi | null;
  trafficInfos: UserMarketTrafficInfoApi[];
  brandsPublic: boolean;
  mapImageUrl: string | null;
  selectedDate: string | null;
  selectedStall: UserMarketSelectedStallApi | null;
}

export interface UserMarketOrganizerApi {
  organizerName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  serviceDays: string | null;
  serviceStartTime: string | null;
  serviceEndTime: string | null;
}

export interface UserMarketTrafficInfoApi {
  method: string | null;
  details: string | null;
}

export interface UserMarketSelectedStallApi {
  stallNo: string | null;
  brand: UserMarketStallBrandApi | null;
}

export interface UserMarketStallBrandApi {
  vendorProfileId: number;
  brandName: string | null;
  category: UserCategoryApi | null;
  brandSummary: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  avatarImageUrl: string | null;
  coverImageUrl: string | null;
}

export interface UserEventStallStatusApi {
  stallId: number;
  eventId: number;
  zoneId: number;
  zoneName: string | null;
  stallNo: string | null;
  width: number | null;
  length: number | null;
  status: string | null;
  vendorName: string | null;
}

export interface UserBrandSearchParams {
  keyword?: string;
  categoryName?: string;
  marketName?: string;
  page?: number;
  pageSize?: number;
}

export interface UserBrandSearchResponse {
  totalCount: number;
  brands: PageResponse<UserBrandSummaryApi>;
}

export interface UserBrandSummaryApi {
  brandId: number;
  mainImageUrl: string | null;
  avatarImageUrl: string | null;
  brandName: string;
  brandSummary: string | null;
  participatedMarketCount: number;
  representativeProducts: UserBrandProductSummaryApi[];
  category: UserCategoryApi | null;
}

export interface UserBrandProductSummaryApi {
  productId: number;
  productName: string;
}

export interface UserBrandDetailApi extends UserBrandSummaryApi {
  brandDescription: string | null;
  representativeProducts: UserBrandProductApi[];
  participatedMarkets: UserBrandMarketApi[];
  links: UserBrandLinksApi;
}

export interface UserBrandProductApi {
  productId: number;
  productImageUrl: string | null;
  productName: string;
  productPrice: number | null;
  productShortDescription: string | null;
}

export interface UserBrandMarketApi {
  eventId: number;
  eventTitle: string;
  eventStartAt: string | null;
  eventEndAt: string | null;
}

export interface UserBrandLinksApi {
  instagramUrl: string | null;
  facebookUrl: string | null;
  websiteUrl: string | null;
}
