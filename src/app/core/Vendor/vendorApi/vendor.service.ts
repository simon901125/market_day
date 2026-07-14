import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSearch } from '../../../models/interface/shared/EventSearch';
import { ApiResult } from '../../../models/interface/shared/ApiResult';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) {}

  /**
   * 攤主專區活動查詢
   * @param data
   * @returns
   */
  searchMarkets(data: EventSearch = {}): Observable<ApiResult<unknown>> {
    // 建立基本查詢參數
    let params = new HttpParams()
      .set('page', String(data.page ?? 1)) //page 是 null 或 undefined 時使用 1
      .set('pageSize', String(data.pageSize ?? 6));

    params = this.setOptionalParam(params, 'keyword', data.keyword);

    //加入非必要條件
    params = this.setOptionalParam(params, 'keyword', data.keyword);
    params = this.setOptionalParam(params, 'city', data.city);
    params = this.setOptionalParam(params, 'district', data.district);
    params = this.setOptionalParam(params, 'status', data.status);
    params = this.setOptionalParam(params, 'event_start_at', this.formatDate(data.eventStartAt));
    params = this.setOptionalParam(params, 'event_end_at', this.formatDate(data.eventEndAt));

    // 這裡要加回傳出來的格式 (intereface)
    const url = `${environment.apiBaseUrl}api/vendor/markets/search`;
    return this.http.post<ApiResult<unknown>>(url, null, { params });
  }

  /**
   * 判斷是否真的有值
   * @param params 
   * @param name 
   * @param value 
   * @returns 
   */
  private setOptionalParam(
    params: HttpParams,
    name: string,
    value: string | String | undefined,
  ): HttpParams {
    const normalizedValue = value?.toString().trim();
    return normalizedValue ? params.set(name, normalizedValue) : params;
  }

  /**
   * 轉換日期
   * @param value 前端取得的日期
   * @returns yyyy-MM-dd
   */
  private formatDate(value?: Date): string | undefined {
    if (!value) return undefined;

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
