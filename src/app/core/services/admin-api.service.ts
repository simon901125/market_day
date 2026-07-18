import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminDashboardOverview } from '../../models/interface/admin/AdminDashboardOverview';
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
}
