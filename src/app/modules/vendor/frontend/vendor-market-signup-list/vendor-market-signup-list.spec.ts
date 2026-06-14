import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMarketSignupList } from './vendor-market-signup-list';

describe('VendorMarketSignupList', () => {
  let component: VendorMarketSignupList;
  let fixture: ComponentFixture<VendorMarketSignupList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketSignupList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketSignupList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
