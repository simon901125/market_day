import { Injectable } from '@angular/core';

import { HttpService } from '../../../core/http/http.service';
import {
  PageResponse,
  UserEventStallStatusApi,
  UserMarketCardApi,
  UserMarketDetailApi,
  UserMarketSearchParams,
} from '../../../models/interface/user/UserPublicApi';

@Injectable({
  providedIn: 'root',
})
export class UserMarketApiService {
  constructor(private readonly httpService: HttpService) {}

  searchMarkets(params: UserMarketSearchParams) {
    return this.httpService.post<PageResponse<UserMarketCardApi>>(
      `api/markets/search${this.toQueryString(params)}`,
      {}
    );
  }

  getMarketDetail(id: string | number, params: { date?: string; stallNo?: string } = {}) {
    return this.httpService.get<UserMarketDetailApi>(
      `api/markets/${id}${this.toQueryString(params)}`
    );
  }

  getMarketDetailByStall(id: string | number, date: string, stallNo: string) {
    return this.getMarketDetail(id, { date, stallNo });
  }

  getEventStallsStatus(id: string | number, applyDate?: string) {
    return this.httpService.get<UserEventStallStatusApi[]>(
      `api/eventsMap/${id}/stallsStatus${this.toQueryString({ applyDate })}`
    );
  }

  private toQueryString<T extends object>(params: T): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      searchParams.set(key, String(value));
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}
