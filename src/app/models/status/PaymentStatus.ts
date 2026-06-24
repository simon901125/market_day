/** 收款管理狀態 */
export class PaymentStatus {
  /** 待付款 */
  static readonly pending = '待付款';
  /** 付款成功 */
  static readonly paid = '付款成功';
  /** 付款失敗 */
  static readonly failed = '付款失敗';
  /** 已逾期 */
  static readonly expired = '已逾期';
  /** 退款申請中 */
  static readonly refundRequested = '退款申請中';
  /** 退款處理中 */
  static readonly refunding = '退款處理中';
  /** 已退款 */
  static readonly refunded = '已退款';

  /** 付款狀態對應的標籤樣式 */
  static readonly classMap: Record<string, string> = {
    [PaymentStatus.pending]: 'tag-yellow',
    [PaymentStatus.paid]: 'tag-green',
    [PaymentStatus.failed]: 'tag-red',
    [PaymentStatus.expired]: 'tag-grey',
    [PaymentStatus.refundRequested]: 'tag-orange',
    [PaymentStatus.refunding]: 'tag-purple',
    [PaymentStatus.refunded]: 'tag-pink',
  };

  /** 取得付款狀態標籤樣式 */
  static getClass(status: string): string {
    return PaymentStatus.classMap[status] ?? 'tag-grey';
  }
}