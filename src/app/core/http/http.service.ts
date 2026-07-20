import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, finalize, Observable, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiResult } from '../../models/interface/shared/ApiResult';
import { LoadingService } from '../services/loading.service';

export interface HttpRequestOptions {
  skipLoading?: boolean;
  timeoutMs?: number;
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

  download(api: string, options: HttpRequestOptions = {}): Observable<Blob> {
    return this.withOptionalLoading(
      this.http.get(this.getUrl(api), { responseType: 'blob' }),
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
    const protectedRequest$ = options.timeoutMs
      ? request$.pipe(timeout({ first: options.timeoutMs }))
      : request$;
    return options.skipLoading ? protectedRequest$ : this.withLoading(protectedRequest$);
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
