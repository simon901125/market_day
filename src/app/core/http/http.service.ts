import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, finalize, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { LoadingService } from '../services/loading.service';

export interface HttpRequestOptions {
  skipLoading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private readonly http: HttpClient,
    private readonly loadingService: LoadingService
  ) {}

  get<T>(api: string, options: HttpRequestOptions = {}): Observable<ApiResult<T>> {
    return this.withOptionalLoading(
      this.http.get<ApiResult<T>>(this.getUrl(api)),
      options
    );
  }

  post<T>(
    api: string,
    body: unknown,
    options: HttpRequestOptions = {}
  ): Observable<ApiResult<T>> {
    return this.withOptionalLoading(
      this.http.post<ApiResult<T>>(this.getUrl(api), body),
      options
    );
  }

  delete<T>(api: string, options: HttpRequestOptions = {}): Observable<ApiResult<T>> {
    return this.withOptionalLoading(
      this.http.delete<ApiResult<T>>(this.getUrl(api)),
      options
    );
  }

  upload<T>(
    api: string,
    formData: FormData,
    options: HttpRequestOptions = {}
  ): Observable<ApiResult<T>> {
    return this.withOptionalLoading(
      this.http.post<ApiResult<T>>(this.getUrl(api), formData),
      options
    );
  }

  private getUrl(api: string): string {
    return `${environment.apiBaseUrl}${api.replace(/^\/+/, '')}`;
  }

  private withOptionalLoading<T>(
    request$: Observable<T>,
    options: HttpRequestOptions
  ): Observable<T> {
    return options.skipLoading ? request$ : this.withLoading(request$);
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
