import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { VendorAccessService } from '../../../../core/Vendor/dashboardApi/vendor-access.service';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { VendorMarketSignupDetail } from './vendor-market-signup-detail';
import { VendorMarketDetail } from '../../../../models/interface/vendor/VendorMarketDetail';

describe('VendorMarketSignupDetail', () => {
  let component: VendorMarketSignupDetail;
  let fixture: ComponentFixture<VendorMarketSignupDetail>;
  const needsProfile = signal(false);
  const authService = jasmine.createSpyObj<AuthService>('AuthService', [
    'isLoggedIn',
    'getUser',
    'getDashboardPath',
  ]);
  const vendorAccess = {
    needsProfile: needsProfile.asReadonly(),
    initialize: jasmine.createSpy('initialize'),
  };

  beforeEach(async () => {
    needsProfile.set(false);
    authService.isLoggedIn.and.returnValue(true);
    authService.getUser.and.returnValue(null);
    authService.getDashboardPath.and.returnValue('/vendor/dash-board');
    vendorAccess.initialize.calls.reset();
    vendorAccess.initialize.and.resolveTo(false);
    await TestBed.configureTestingModule({
      imports: [VendorMarketSignupDetail],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: authService },
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

  it('should show a disabled appearance while keeping the login prompt clickable', () => {
    authService.isLoggedIn.and.returnValue(false);
    component.market = {
      id: '1',
      title: 'Test market',
      time: '10:00 - 18:00',
      start_date: '2026/07/18',
      end_date: '2026/07/18',
      description: '',
      location: '',
      address: '',
      city: '',
      area: '',
      image: '',
      status: '',
      statusClass: '',
      tags: [],
      category: '',
      organizer: '',
      transportation: [],
      slots: [{ date: '07/18', remaining: 1, total: 1 }],
    } as MarketCardItem;
    component.detail = {
      registrationStatus: 'OPEN',
      dailyAvailability: [],
      equipments: [],
    } as unknown as VendorMarketDetail;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.signup-button');
    expect(button.disabled).toBeFalse();
    expect(button.classList.contains('login-required')).toBeTrue();
    expect(button.getAttribute('aria-disabled')).toBe('true');
  });

  it('should confirm and navigate to vendor login when the vendor is not logged in', async () => {
    authService.isLoggedIn.and.returnValue(false);
    const alert = TestBed.inject(AlertService);
    const router = TestBed.inject(Router);
    const confirmSpy = spyOn(alert, 'confirm').and.resolveTo(true);
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    await component.goToSignUpForm();

    expect(confirmSpy).toHaveBeenCalledWith(
      '請先登入',
      '登入攤主帳號後即可報名市集。',
      '前往登入',
      '取消',
    );
    expect(navigateSpy).toHaveBeenCalledOnceWith(['/vendor/login']);
  });

  it('should map every API category to a visible market tag', () => {
    const detail = {
      categories: [
        { id: 1, name: '文創手作', slug: 'handmade' },
        { id: 2, name: '甜點飲品', slug: 'dessert' },
      ],
      registrationStatus: 'OPEN',
      trafficInfos: [],
      dailyAvailability: [],
    } as unknown as VendorMarketDetail;

    const market = (
      component as unknown as {
        toMarketCard(value: VendorMarketDetail): { tags: string[]; category: string };
      }
    ).toMarketCard(detail);

    expect(market.tags).toEqual(['文創手作', '甜點飲品']);
    expect(market.category).toBe('文創手作、甜點飲品');
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
