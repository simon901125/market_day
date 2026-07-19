import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizerDashboardInit } from '../../models/interface/organizer/OrganizerDashboardInit';
import {
  OrganizerProfile,
  OrganizerProfileSaveRequest,
} from '../../models/interface/organizer/OrganizerProfile';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { OrganizerEventSearchResponse } from '../../models/interface/organizer/OrganizerEventSearch';
import { OrganizerApplicationSearchResponse } from '../../models/interface/organizer/OrganizerApplicationSearch';
import { OrganizerEventDetail } from '../../models/interface/organizer/OrganizerEventDetail';
import {
  OrganizerEventSaveRequest,
  OrganizerEventSubmitReviewResponse,
  OrganizerEventWithdrawResponse,
  OrganizerEventPublishResponse,
  OrganizerEventUnpublishRequestResponse,
  StoredEventImage,
} from '../../models/interface/organizer/OrganizerEventEditor';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizerApiService {
  constructor(private readonly httpService: HttpService) {}

  getOrganizerDashboardInit(): Observable<ApiResult<OrganizerDashboardInit>> {
    return this.httpService.get<OrganizerDashboardInit>('api/organizer/dashboard/init');
  }

  searchOrganizerEvents(params: {
    keyword?: string;
    status?: string;
    startDate?: string | null;
    endDate?: string | null;
    sort?: 'DEFAULT' | 'UPCOMING_FIRST';
    page?: number;
    pageSize?: number;
    registrationOverview?: boolean;
  } = {}): Observable<ApiResult<OrganizerEventSearchResponse>> {
    const query = new URLSearchParams();
    if (params.keyword) query.set('keyword', params.keyword);
    if (params.status) query.set('status', params.status);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    query.set('sort', params.sort ?? 'DEFAULT');
    query.set('page', String(params.page ?? 1));
    query.set('pageSize', String(params.pageSize ?? 6));
    if (params.registrationOverview) query.set('registrationOverview', 'true');
    return this.httpService.get<OrganizerEventSearchResponse>(
      `api/organizer/events/search?${query.toString()}`,
    );
  }

  getOrganizerEventDetail(eventId: number): Observable<ApiResult<OrganizerEventDetail>> {
    return this.httpService.get<OrganizerEventDetail>(
      `api/organizer/events/${eventId}`,
      { skipLoading: true, timeoutMs: 15000 },
    );
  }

  saveOrganizerEvent(payload: OrganizerEventSaveRequest): Observable<ApiResult<OrganizerEventDetail>> {
    return this.httpService.post<OrganizerEventDetail>('api/organizer/events', payload);
  }

  submitOrganizerEventReview(
    eventId: number,
  ): Observable<ApiResult<OrganizerEventSubmitReviewResponse>> {
    return this.httpService.post<OrganizerEventSubmitReviewResponse>(
      `api/organizer/events/${eventId}/submit-review`,
      null,
    );
  }

  withdrawOrganizerEventReview(
    eventId: number,
  ): Observable<ApiResult<OrganizerEventWithdrawResponse>> {
    return this.httpService.post<OrganizerEventWithdrawResponse>(
      `api/organizer/events/${eventId}/withdraw`,
      null,
    );
  }

  publishOrganizerEvent(
    eventId: number,
  ): Observable<ApiResult<OrganizerEventPublishResponse>> {
    return this.httpService.post<OrganizerEventPublishResponse>(
      `api/organizer/events/${eventId}/publish`,
      null,
    );
  }

  requestOrganizerEventUnpublish(
    eventId: number,
    reason: string,
  ): Observable<ApiResult<OrganizerEventUnpublishRequestResponse>> {
    return this.httpService.post<OrganizerEventUnpublishRequestResponse>(
      `api/organizer/events/${eventId}/unpublish-request`,
      { reason },
    );
  }

  uploadOrganizerEventImage(
    eventId: number,
    purpose: 'EVENT_COVER' | 'EVENT_MAP',
    file: File,
  ): Observable<ApiResult<StoredEventImage>> {
    const formData = new FormData();
    formData.append('purpose', purpose);
    formData.append('eventId', String(eventId));
    formData.append('file', file);
    return this.httpService.upload<StoredEventImage>('api/images', formData);
  }

  searchOrganizerApplications(params: { page?: number; pageSize?: number } = {}): Observable<ApiResult<OrganizerApplicationSearchResponse>> {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      pageSize: String(params.pageSize ?? 6),
    });
    return this.httpService.get<OrganizerApplicationSearchResponse>(
      `api/organizer/applications/search?${query.toString()}`,
    );
  }

  getOrganizerProfile(): Observable<ApiResult<OrganizerProfile>> {
    return this.httpService.get<OrganizerProfile>('api/organizer/profile/load');
  }

  postOrganizerProfile(
    payload: OrganizerProfileSaveRequest,
  ): Observable<ApiResult<OrganizerProfile>> {
    return this.httpService.post<OrganizerProfile>('api/organizer/profile/save', payload);
  }
}
