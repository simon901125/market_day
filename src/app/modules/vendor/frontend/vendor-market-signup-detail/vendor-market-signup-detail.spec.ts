import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMarketSignupDetail } from './vendor-market-signup-detail';

describe('VendorMarketSignupDetail', () => {
  let component: VendorMarketSignupDetail;
  let fixture: ComponentFixture<VendorMarketSignupDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketSignupDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketSignupDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
