/** 保證金退還流程狀態。 */
export class DepositStatus {
  /** 不符合保證金退還條件，保證金不予退還。 */
  static readonly pending = '未退還';

  /** 活動結束後，主辦方已完成保證金退還。 */
  static readonly refunded = '已退還';

  /** 保證金狀態對應的標籤樣式。 */
  static readonly classMap: Record<string, string> = {
    [DepositStatus.pending]: 'tag-deposit-pending',
    [DepositStatus.refunded]: 'tag-deposit-refunded',
  };

  /** 取得保證金狀態標籤樣式。 */
  static getClass(status: string): string {
    return DepositStatus.classMap[status] ?? 'tag-deposit-pending';
  }
}
