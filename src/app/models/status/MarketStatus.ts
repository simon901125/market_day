/** 市集狀態 */
export class MarketStatus {
  /** 活動預告 */
  static readonly preview = '活動預告';
  /** 即將開始 */
  static readonly upcoming = '即將開始';
  /** 進行中 */
  static readonly active = '進行中';
  /** 已結束 */
  static readonly ended = '已結束';
  /** 狀態對應的 CSS 類別 */
  static readonly classMap: Record<string, string> = {
    [MarketStatus.preview]: 'preview',
    [MarketStatus.upcoming]: 'upcoming',
    [MarketStatus.active]: 'active',
    [MarketStatus.ended]: 'ended',
  };
  /**
   * 根據市集狀態獲取對應的 CSS 類別
   * @param status 狀態名稱
   * @returns CSS 類別名稱，如果狀態未定義則返回空字串
   */
  static getClass(status: string): string {
    return MarketStatus.classMap[status] ?? '';
  }
}