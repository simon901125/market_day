import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, finalize, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { LoadingService } from '../services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private readonly http: HttpClient,
    private readonly loadingService: LoadingService
  ) {}

  get<T>(api: string): Observable<ApiResult<T>> {
    return this.withLoading(this.http.get<ApiResult<T>>(this.getUrl(api)));
  }

  post<T>(api: string, body: unknown): Observable<ApiResult<T>> {
    return this.withLoading(
      this.http.post<ApiResult<T>>(this.getUrl(api), body)
    );
  }

  delete<T>(api: string): Observable<ApiResult<T>> {
    return this.withLoading(this.http.delete<ApiResult<T>>(this.getUrl(api)));
  }

  upload<T>(api: string, formData: FormData): Observable<ApiResult<T>> {
    return this.withLoading(
      this.http.post<ApiResult<T>>(this.getUrl(api), formData)
    );
  }

  private getUrl(api: string): string {
    return `${environment.apiBaseUrl}${api.replace(/^\/+/, '')}`;
  }

  private withLoading<T>(request$: Observable<T>): Observable<T> {
    return defer(() => {
      this.loadingService.startLoading();

      return request$.pipe(
        finalize(() => this.loadingService.stopLoading())
      );
    });
  }
}
