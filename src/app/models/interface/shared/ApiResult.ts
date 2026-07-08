export interface ApiResult<T = unknown> {
  statusCode: number;
  message: string;
  messageDetails: string | null;
  data: T;
}

export function isApiSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}
