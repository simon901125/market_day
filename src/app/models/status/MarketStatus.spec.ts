import { MarketStatus } from './MarketStatus';

describe('MarketStatus', () => {
  it('should normalize legacy public API labels to the system statuses', () => {
    expect(MarketStatus.fromApiStatus('籌備中')).toBe(MarketStatus.preview);
    expect(MarketStatus.fromApiStatus('準備開始')).toBe(MarketStatus.upcoming);
    expect(MarketStatus.fromApiStatus('活動進行中')).toBe(MarketStatus.active);
  });

  it('should use the normalized label when resolving the status style', () => {
    expect(MarketStatus.getClass('準備開始')).toBe('upcoming');
  });
});
