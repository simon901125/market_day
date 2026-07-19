import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../models/interface/shared/ApiResult';
import { NotificationToggleResult } from '../../models/interface/shared/NotificationToggle';
import { HttpRequestOptions, HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  constructor(private readonly httpService: HttpService) {}

  markAsRead(
    id: number,
    options: HttpRequestOptions = {},
  ): Observable<ApiResult<NotificationToggleResult>> {
    return this.httpService.post<NotificationToggleResult>(`api/notification/${id}/isRead`, {}, options);
  }
}
