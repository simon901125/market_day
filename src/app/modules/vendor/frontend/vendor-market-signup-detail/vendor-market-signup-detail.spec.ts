import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';

import { AlertService } from '../../../../core/services/alert.service';
import { VendorAccessService } from '../../../../core/services/vendor-access.service';
import { VendorMarketSignupDetail } from './vendor-market-signup-detail';

describe('VendorMarketSignupDetail', () => {
  let component: VendorMarketSignupDetail;
  let fixture: ComponentFixture<VendorMarketSignupDetail>;
  const needsProfile = signal(false);
  const vendorAccess = {
    needsProfile: needsProfile.asReadonly(),
    initialize: jasmine.createSpy('initialize'),
  };

  beforeEach(async () => {
    needsProfile.set(false);
    vendorAccess.initialize.calls.reset();
    vendorAccess.initialize.and.resolveTo(false);
    await TestBed.configureTestingModule({
      imports: [VendorMarketSignupDetail],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: VendorAccessService, useValue: vendorAccess },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorMarketSignupDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show setup alert and stop signup when vendor profile is required', async () => {
    vendorAccess.initialize.and.resolveTo(true);
    const alert = TestBed.inject(AlertService);
    const router = TestBed.inject(Router);
    const confirmSpy = spyOn(alert, 'confirm').and.resolveTo(false);
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    await component.goToSignUpForm();

    expect(confirmSpy).toHaveBeenCalledWith(
      '請先完成攤位資料',
      '完成「我的攤位」資料並儲存後，才能報名市集。',
      '立即設定',
      '稍後再說',
    );
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
