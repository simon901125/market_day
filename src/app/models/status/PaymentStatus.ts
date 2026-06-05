/** 收款管理狀態 */
export class PaymentStatus {
  /** 待付款 */
  static readonly pending = '待付款';
  /** 待付款 */
  static readonly paid = '付款成功';
  /** 付款失敗 */
  static readonly failed = '付款失敗';
  /** 退款處理中 */
  static readonly refunding = '退款處理中';
  /** 已退款 */
  static readonly refunded = '已退款';
}
