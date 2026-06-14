import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMarketSearchPanel } from './vendor-market-search-panel';

describe('VendorMarketSearchPanel', () => {
  let component: VendorMarketSearchPanel;
  let fixture: ComponentFixture<VendorMarketSearchPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketSearchPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketSearchPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
