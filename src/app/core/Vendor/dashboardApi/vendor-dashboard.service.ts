import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResult } from '../../../models/interface/shared/ApiResult';
import { VendorDashboardInit } from '../../../models/interface/vendor/VendorDashboardInit';
import {
  VendorApplicationSearchParams,
  VendorApplicationSearchResult,
} from '../../../models/interface/vendor/VendorApplicationSearch';
import { VendorApplicationApiDetail } from '../../../models/interface/vendor/VendorApplicationApiDetail';
import { VendorStallMap } from '../../../models/interface/vendor/VendorStallMap';
import {
  NewebPayPaymentForm,
  VendorPaymentStatus,
} from '../../../models/interface/vendor/VendorPayment';
import {
  VendorStallSelectionRequest,
  VendorStallSelectionResult,
} from '../../../models/interface/vendor/VendorStallSelection';
import {
  VendorStallInfo,
  VendorStallSaveRequest,
  StoredVendorImage,
  VendorImagePurpose,
} from '../../../models/interface/vendor/VendorStallInfo';
import { VendorService } from '../vendorApi/vendor.service';
@Injectable({
  providedIn: 'root',
})
export class VendorDashboardService {
  constructor(
    private readonly http: HttpClient,
    private readonly vendorService: VendorService,
  ) {}

  /** 判斷攤主是否為首次登入 */
  getVendorFirstLogin(): Observable<ApiResult<VendorDashboardInit>> {
    const url = `${environment.apiBaseUrl}api/vendor/dashboard/init`;
    return this.http.get<ApiResult<VendorDashboardInit>>(url);
  }

  /** 搜尋目前登入攤主的報名紀錄。 */
  searchVendorApplications(
    search: VendorApplicationSearchParams = {},
  ): Observable<ApiResult<VendorApplicationSearchResult>> {
    const url = `${environment.apiBaseUrl}api/vendor/applications/search`;
    let params = new HttpParams();

    // 日期參數依 StallController 的 snake_case 命名送出，其餘維持後端定義的 camelCase。
    const queryValues: Record<string, string | number | undefined> = {
      eventTitle: search.eventTitle?.trim() || undefined,
      status: search.status?.trim() || undefined,
      event_start_at: search.eventStartAt || undefined,
      event_end_at: search.eventEndAt || undefined,
      page: search.page,
      pageSize: search.pageSize,
    };

    // 空白條件不放入 query string，讓後端的 optional/defaultValue 生效。
    for (const [key, value] of Object.entries(queryValues)) {
      if (value !== undefined) {
        params = params.set(key, String(value));
      }
    }

    return this.http.get<ApiResult<VendorApplicationSearchResult>>(url, { params });
  }

  /** 依報名 ID 取得目前登入攤主自己的報名詳情。 */
  getVendorApplicationDetail(
    applicationId: number,
  ): Observable<ApiResult<VendorApplicationApiDetail>> {
    const url = `${environment.apiBaseUrl}api/vendor/applications/${applicationId}`;
    return this.http.get<ApiResult<VendorApplicationApiDetail>>(url);
  }

  /** 由後端建立藍新 MPG 交易資料；金額一律由後端依報名資料決定。 */
  createNewebPayPayment(
    applicationNo: string,
  ): Observable<ApiResult<NewebPayPaymentForm>> {
    const url = `${environment.apiBaseUrl}api/vendor/payments/newebpay`;
    return this.http.post<ApiResult<NewebPayPaymentForm>>(url, {
      applicationNo: applicationNo.trim(),
    });
  }

  /** 取得後端保存的付款狀態，不採信瀏覽器回傳的金流結果。 */
  getVendorPaymentStatus(
    applicationNo: string,
  ): Observable<ApiResult<VendorPaymentStatus>> {
    const encodedApplicationNo = encodeURIComponent(applicationNo.trim());
    const url = `${environment.apiBaseUrl}api/vendor/payments/${encodedApplicationNo}/status`;
    return this.http.get<ApiResult<VendorPaymentStatus>>(url);
  }

  /** 依報名編號取得目前登入攤主的選位地圖。 */
  getVendorStallMap(
    applicationNo: string,
    applyDate?: string,
  ): Observable<ApiResult<VendorStallMap>> {
    const encodedApplicationNo = encodeURIComponent(applicationNo.trim());
    const url = `${environment.apiBaseUrl}api/vendor/stall-map/${encodedApplicationNo}`;
    let params = new HttpParams();

    if (applyDate?.trim()) {
      params = params.set('applyDate', applyDate.trim());
    }

    return this.http.get<ApiResult<VendorStallMap>>(url, { params });
  }

  /** 將同一筆報名中尚未選位的日期一次送至 StallController.selectEventStall()。 */
  selectEventStall(
    selection: VendorStallSelectionRequest,
  ): Observable<ApiResult<VendorStallSelectionResult>> {
    const url = `${environment.apiBaseUrl}api/stalls/select`;
    return this.http.post<ApiResult<VendorStallSelectionResult>>(url, selection);
  }

  /** 取得攤主攤位資料 */
  getVendorStallInfo(): Observable<ApiResult<VendorStallInfo>> {
    return this.vendorService.getVendorStallInfo();
  }

  /** 儲存攤主攤位資料 */
  saveVendorStallInfo(data: VendorStallSaveRequest): Observable<ApiResult<VendorStallInfo>> {
    return this.vendorService.saveVendorStallInfo(data);
  }

  /** 上傳攤主品牌圖片。 */
  uploadVendorImage(
    file: File,
    purpose: VendorImagePurpose,
  ): Observable<ApiResult<StoredVendorImage>> {
    return this.vendorService.uploadVendorImage(file, purpose);
  }
}
