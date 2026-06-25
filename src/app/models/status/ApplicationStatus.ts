/** 報名管理狀態。 */
export class ApplicationStatus {
  /** 報名狀態篩選：全部狀態。 */
  static readonly all = '全部狀態';

  /** 等待主辦方審核報名資料。 */
  static readonly pendingReview = '待審核';
  /** 不符合活動資格，報名已被退回。 */
  static readonly reviewRejected = '審核未通過';
  /** 審核通過後，等待攤主完成付款。 */
  static readonly pendingPayment = '待付款';
  /** 已完成付款，等待攤主選擇攤位。 */
  static readonly pendingSelection = '待選位';
  /** 已完成選位並取得活動資格。 */
  static readonly completed = '報名完成';
  /** 活動結束後，主辦方已完成保證金退還。 */
  static readonly depositReturned = '保證金已退還';
  /** 攤主提出退款申請，等待主辦方審核。 */
  static readonly refundPending = '退款申請中';
  /** 主辦方已同意退款，等待退款作業完成。 */
  static readonly refunding = '退款處理中';
  /** 已完成退款並取消報名資格。 */
  static readonly refunded = '已退款';
  /** 付款逾期失效，報名資格已取消。 */
  static readonly cancelled = '已取消';

  /** 所有可顯示的報名狀態。 */
  static readonly list: string[] = [
    ApplicationStatus.pendingReview,
    ApplicationStatus.reviewRejected,
    ApplicationStatus.pendingPayment,
    ApplicationStatus.pendingSelection,
    ApplicationStatus.completed,
    ApplicationStatus.depositReturned,
    ApplicationStatus.refundPending,
    ApplicationStatus.refunding,
    ApplicationStatus.refunded,
    ApplicationStatus.cancelled,
  ];

  /** 報名狀態篩選選項。 */
  static readonly filterList: string[] = [
    ApplicationStatus.all,
    ...ApplicationStatus.list,
  ];

  /** 報名狀態對應的標籤樣式。 */
  static readonly classMap: Record<string, string> = {
    [ApplicationStatus.pendingReview]: 'tag-orange',
    [ApplicationStatus.reviewRejected]: 'tag-red',
    [ApplicationStatus.pendingPayment]: 'tag-orange',
    [ApplicationStatus.pendingSelection]: 'tag-blue',
    [ApplicationStatus.completed]: 'tag-green',
    [ApplicationStatus.depositReturned]: 'tag-green',
    [ApplicationStatus.refundPending]: 'tag-orange',
    [ApplicationStatus.refunding]: 'tag-purple',
    [ApplicationStatus.refunded]: 'tag-pink',
    [ApplicationStatus.cancelled]: 'tag-grey',
  };

  static getClass(status: string): string {
    return ApplicationStatus.classMap[status] ?? 'tag-grey';
  }
}
