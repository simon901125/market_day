/** 市集活動狀態 */
export class MarketStatus {
  /** 活動預告：資訊尚未公開 */
  static readonly preview = '活動預告';
  /** 即將開始：資訊已公開 */
  static readonly upcoming = '即將開始';
  /** 活動進行中 */
  static readonly active = '進行中';
  /** 歷史活動 */
  static readonly ended = '已結束';

  /** 狀態對應 CSS class */
  static readonly classMap: Record<string, string> = {
    [MarketStatus.preview]: 'preview',
    [MarketStatus.upcoming]: 'upcoming',
    [MarketStatus.active]: 'active',
    [MarketStatus.ended]: 'ended',
  };

  static getClass(status: string): string {
    return MarketStatus.classMap[status] ?? '';
  }
}
