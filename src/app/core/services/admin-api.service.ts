import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminDashboardOverview } from '../../models/interface/admin/AdminDashboardOverview';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  constructor(private readonly httpService: HttpService) {}

  getDashboardOverview(): Observable<ApiResult<AdminDashboardOverview>> {
    return this.httpService.get<AdminDashboardOverview>('api/admin/dashboard/overview');
  }
}
