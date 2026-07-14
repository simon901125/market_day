import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OrganizerDashboardInit } from '../../models/interface/organizer/OrganizerDashboardInit';
import {
  OrganizerProfile,
  OrganizerProfileSaveRequest,
} from '../../models/interface/organizer/OrganizerProfile';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class OrganizerApiService {
  constructor(private readonly httpService: HttpService) {}

  getOrganizerDashboardInit(): Observable<ApiResult<OrganizerDashboardInit>> {
    return this.httpService.get<OrganizerDashboardInit>('api/organizer/dashboard/init');
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
