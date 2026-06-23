/** 報名管理狀態 */
export class ApplicationStatus {
  /** 待審核 */
  static readonly pendingReview = '待審核';
  /** 審核未通過 */
  static readonly reviewRejected = '審核未通過';
  /** 待付款 */
  static readonly pendingPayment = '待付款';
  /** 待選位 */
  static readonly pendingSelection = '待選位';
  /** 報名完成 */
  static readonly completed = '報名完成';
  /** 退款申請中 */
  static readonly refundPending = '退款申請中';
  /** 退款處理中 */
  static readonly refunding = '退款處理中';
  /** 已退款 */
  static readonly refunded = '已退款';
  /** 報名完成 */
  static readonly cancelled = '已取消';

  /** 報名狀態對應的標籤樣式 */
  static readonly classMap: Record<string, string> = {
    [ApplicationStatus.completed]: 'tag-green',
    [ApplicationStatus.pendingReview]: 'tag-orange',
    [ApplicationStatus.pendingPayment]: 'tag-orange',
    [ApplicationStatus.pendingSelection]: 'blue',
    [ApplicationStatus.reviewRejected]: 'tag-red',
    [ApplicationStatus.refundPending]: 'tag-orange',
    [ApplicationStatus.refunding]: 'tag-purple',
    [ApplicationStatus.refunded]: 'tag-pink',
    [ApplicationStatus.cancelled]: 'tag-grey',
  };

  /** 取得報名狀態標籤樣式 */
  static getClass(status: string): string {
    return ApplicationStatus.classMap[status] ?? 'tag-grey';
  }
}