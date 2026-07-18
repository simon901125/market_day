import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../../models/interface/shared/ApiResult';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root',
})
export class AddressApiService {
  constructor(private readonly httpService: HttpService) {}

  getAddressCities(): Observable<ApiResult<string[]>> {
    return this.httpService.get<string[]>(
      'api/addresses/cities',
      { skipLoading: true, timeoutMs: 10000 },
    );
  }

  getAddressDistricts(city: string): Observable<ApiResult<string[]>> {
    return this.httpService.get<string[]>(
      `api/addresses/districts?city=${encodeURIComponent(city)}`,
      { skipLoading: true, timeoutMs: 10000 },
    );
  }
}
