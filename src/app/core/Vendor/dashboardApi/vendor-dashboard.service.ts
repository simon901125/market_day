import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResult } from '../../../models/interface/shared/ApiResult';
import { VendorDashboardInit } from '../../../models/interface/vendor/VendorDashboardInit';
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
