export class MarketStatus {
  /** 目前在報名期間內且仍有可用攤位。 */
  static readonly registrationOpen = '報名中';

  /** 目前在報名期間內，但所有活動日皆已無剩餘攤位。 */
  static readonly full = '已額滿';

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
    [MarketStatus.registrationOpen]: 'status-active',
    [MarketStatus.full]: 'status-full',
    [MarketStatus.preview]: 'preview',
    [MarketStatus.upcoming]: 'upcoming',
    [MarketStatus.active]: 'active',
    [MarketStatus.ended]: 'ended',
  };

  /** 將公開活動 API 的狀態統一成前台正式顯示名稱。 */
  static readonly apiStatusMap: Record<string, string> = {
    活動預告: MarketStatus.preview,
    籌備中: MarketStatus.preview,
    即將開始: MarketStatus.upcoming,
    準備開始: MarketStatus.upcoming,
    進行中: MarketStatus.active,
    活動進行中: MarketStatus.active,
    已結束: MarketStatus.ended,
  };

  static fromApiStatus(status: string | null | undefined): string {
    const value = status?.trim() ?? '';
    return MarketStatus.apiStatusMap[value] ?? value;
  }

  static getClass(status: string): string {
    return MarketStatus.classMap[MarketStatus.fromApiStatus(status)] ?? '';
  }
}
