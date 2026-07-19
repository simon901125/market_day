import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSearch } from '../../../models/interface/shared/EventSearch';
import { ApiResult } from '../../../models/interface/shared/ApiResult';
import { environment } from '../../../../environments/environment';
import { VendorMarketDetail } from '../../../models/interface/vendor/VendorMarketDetail';
import { VendorMarketSearchResponse } from '../../../models/interface/vendor/VendorMarketSearch';
import {
  VendorApplicationSubmitRequest,
  VendorApplicationSubmitResponse,
} from '../../../models/interface/vendor/VendorApplicationSubmit';
import {
  VendorStallInfo,
  VendorStallSaveRequest,
} from '../../../models/interface/vendor/VendorStallInfo';
import { VendorApplicationDetailApiResponse } from '../../../models/interface/vendor/VendorApplicationDetail';

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
  searchMarkets(data: EventSearch = {}): Observable<ApiResult<VendorMarketSearchResponse>> {
    // 建立基本查詢參數
    let params = new HttpParams()
      .set('page', String(data.page ?? 1)) //page 是 null 或 undefined 時使用 1
      .set('pageSize', String(data.pageSize ?? 6));

    //加入非必要條件
    params = this.setOptionalParam(params, 'keyword', data.keyword);
    params = this.setOptionalParam(params, 'city', data.city);
    params = this.setOptionalParam(params, 'district', data.district);
    params = this.setOptionalParam(params, 'status', data.status);
    params = this.setOptionalParam(params, 'event_start_at', this.formatDate(data.eventStartAt));
    params = this.setOptionalParam(params, 'event_end_at', this.formatDate(data.eventEndAt));

    const url = `${environment.apiBaseUrl}api/vendor/markets/search`;
    return this.http.post<ApiResult<VendorMarketSearchResponse>>(url, null, { params });
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
    value: string | undefined,
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

  /** GET 取得攤主報名前的公開活動詳細資料。 */
  getMarketDetail(id: number | string): Observable<ApiResult<VendorMarketDetail>> {
    const url = `${environment.apiBaseUrl}api/vendor/markets/${id}`;
    return this.http.get<ApiResult<VendorMarketDetail>>(url);
  }

  /** 送出攤主市集報名申請。Authorization 由 authInterceptor 自動附加。 */
  submitVendorApplication(
    data: VendorApplicationSubmitRequest,
  ): Observable<ApiResult<VendorApplicationSubmitResponse>> {
    const url = `${environment.apiBaseUrl}api/vendor/applications`;
    return this.http.post<ApiResult<VendorApplicationSubmitResponse>>(url, data);
  }

  /** 取得目前登入攤主的報名詳情。 */
  getVendorApplicationDetail(
    applicationId: number,
  ): Observable<ApiResult<VendorApplicationDetailApiResponse>> {
    const url = `${environment.apiBaseUrl}api/vendor/applications/${applicationId}`;
    return this.http.get<ApiResult<VendorApplicationDetailApiResponse>>(url);
  }

  /** 取得目前登入攤主的攤位資料。Authorization 由 authInterceptor 自動附加。 */
  getVendorStallInfo(): Observable<ApiResult<VendorStallInfo>> {
    const url = `${environment.apiBaseUrl}api/vendor/stall/load`;
    return this.http.get<ApiResult<VendorStallInfo>>(url);
  }

  /** 儲存目前登入攤主的攤位資料。Authorization 由 authInterceptor 自動附加。 */
  saveVendorStallInfo(
    data: VendorStallSaveRequest,
  ): Observable<ApiResult<VendorStallInfo>> {
    const url = `${environment.apiBaseUrl}api/vendor/stall/save`;
    return this.http.post<ApiResult<VendorStallInfo>>(url, data);
  }
}
