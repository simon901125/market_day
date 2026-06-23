export class MarketStatus {
  /** 活動開始前 8 天以上，僅顯示活動基本資訊。 */
  static readonly preview = '活動預告';

  /** 活動開始前 7 天內，攤位地圖與品牌資訊會公開。 */
  static readonly upcoming = '即將開始';

  /** 活動開始日至活動結束日。 */
  static readonly active = '進行中';

  /** 活動結束後。 */
  static readonly ended = '已結束';

  /** 前台活動狀態篩選選項。 */
  static readonly filterList = [
    '全部狀態',
    MarketStatus.preview,
    MarketStatus.upcoming,
    MarketStatus.active,
    MarketStatus.ended,
  ];

  /** 狀態對應的 CSS class。 */
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
