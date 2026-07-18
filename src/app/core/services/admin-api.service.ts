import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminDashboardOverview } from '../../models/interface/admin/AdminDashboardOverview';
import { EventRevisionRequest, EventStatusChangeDto } from '../../models/interface/admin/AdminEventAction';
import { AdminEventDetailDto, AdminEventStatusLogPage } from '../../models/interface/admin/AdminEventDetail';
import { AdminEventPage, AdminEventSearchRequest } from '../../models/interface/admin/AdminEventSearch';
import { AdminNoticePage, AdminNoticeSearchRequest } from '../../models/interface/admin/AdminNoticeSearch';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { HttpRequestOptions, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  constructor(private readonly httpService: HttpService) {}

  getDashboardOverview(): Observable<ApiResult<AdminDashboardOverview>> {
    return this.httpService.get<AdminDashboardOverview>('api/admin/dashboard/overview');
  }

  searchNotices(
    request: AdminNoticeSearchRequest,
    options: HttpRequestOptions = {},
  ): Observable<ApiResult<AdminNoticePage>> {
    return this.httpService.post<AdminNoticePage>('api/admin/notices/search', request, options);
  }

  searchEvents(
    request: AdminEventSearchRequest,
    options: HttpRequestOptions = {},
  ): Observable<ApiResult<AdminEventPage>> {
    return this.httpService.post<AdminEventPage>('api/admin/events/search', request, options);
  }

  getEventDetail(id: number): Observable<ApiResult<AdminEventDetailDto>> {
    return this.httpService.get<AdminEventDetailDto>(`api/admin/events/${id}`);
  }

  getEventStatusLogs(
    id: number,
    page: number,
    size: number,
    options: HttpRequestOptions = {},
  ): Observable<ApiResult<AdminEventStatusLogPage>> {
    return this.httpService.get<AdminEventStatusLogPage>(
      `api/admin/events/${id}?page=${page}&size=${size}`,
      options,
    );
  }

  /** 活動審核通過，將活動狀態改為地圖建置中 */
  approveEvent(id: number, note: string | null = null): Observable<ApiResult<EventStatusChangeDto>> {
    return this.httpService.post<EventStatusChangeDto>(`api/admin/events/${id}/approve`, note);
  }

  /**
   * 活動要求補件，或退回下架申請（要求補件）
   *
   * isUnpublish 為 false/null 時 id 為活動 id；為 true 時 id 為下架申請單 id（EventUnpublishRequest.id）
   */
  requestEventRevision(
    id: number,
    request: EventRevisionRequest,
  ): Observable<ApiResult<EventStatusChangeDto>> {
    return this.httpService.post<EventStatusChangeDto>(`api/admin/events/${id}/request-revision`, request);
  }

  /** 活動地圖建置完成，將活動狀態改為待發布 */
  completeEventMapBuilding(id: number): Observable<ApiResult<EventStatusChangeDto>> {
    return this.httpService.post<EventStatusChangeDto>(`api/admin/events/${id}/map-complete`, null);
  }

  /** 確認活動下架（同意下架申請） */
  confirmEventUnpublish(id: number, note: string | null = null): Observable<ApiResult<EventStatusChangeDto>> {
    return this.httpService.post<EventStatusChangeDto>(`api/admin/events/${id}/unpublish-confirm`, note);
  }
}
