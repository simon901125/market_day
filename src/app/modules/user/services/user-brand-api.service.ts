import { Injectable } from '@angular/core';

import { HttpService } from '../../../core/http/http.service';
import {
  UserBrandDetailApi,
  UserBrandSearchParams,
  UserBrandSearchResponse,
} from '../../../models/interface/user/UserPublicApi';

@Injectable({
  providedIn: 'root',
})
export class UserBrandApiService {
  constructor(private readonly httpService: HttpService) {}

  searchBrands(params: UserBrandSearchParams) {
    return this.httpService.get<UserBrandSearchResponse>(
      `api/brands/search${this.toQueryString(params)}`
    );
  }

  getBrandDetail(id: string | number) {
    return this.httpService.get<UserBrandDetailApi>(`api/brands/${id}`);
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
