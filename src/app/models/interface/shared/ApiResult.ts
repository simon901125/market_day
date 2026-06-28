export interface ApiResult<T = unknown> {
  statusCode: number;
  message: string;
  messageDetails: string | null;
  data: T;
}
