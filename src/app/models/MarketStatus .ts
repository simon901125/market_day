export class MarketStatus {
  static readonly preview = '活動預告';
  static readonly upcoming = '即將開始';
  static readonly active = '進行中';
  static readonly ended = '已結束';

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