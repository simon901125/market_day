import { AddressApiService } from '../../../../core/services/address-api.service';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { VendorMarketSearchPanel } from './vendor-market-search-panel';

describe('VendorMarketSearchPanel', () => {
  it('only exposes open and full registration filters', () => {
    const component = new VendorMarketSearchPanel({} as AddressApiService);

    expect(component.statusOptions).toEqual(['全部狀態', '報名中', '已額滿']);
  });

  it('maps the full label to the FULL API status', () => {
    const component = new VendorMarketSearchPanel({} as AddressApiService);
    let emittedStatus: string | undefined;
    component.search.subscribe((criteria) => (emittedStatus = criteria.status));

    component.selectStatus('已額滿');
    component.submitSearch();

    expect(emittedStatus).toBe('FULL');
  });

  it('uses registration labels instead of activity lifecycle labels', () => {
    expect(MarketStatus.registrationOpen).toBe('報名中');
    expect(MarketStatus.full).toBe('已額滿');
  });
});
