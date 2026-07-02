import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { VendorMarketSignupDetail } from './vendor-market-signup-detail';

describe('VendorMarketSignupDetail', () => {
  let component: VendorMarketSignupDetail;
  let fixture: ComponentFixture<VendorMarketSignupDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketSignupDetail],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMarketSignupDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
