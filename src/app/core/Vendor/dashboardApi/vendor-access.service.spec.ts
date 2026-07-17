import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { VendorDashboardService } from './vendor-dashboard.service';
import { VendorAccessService } from './vendor-access.service';

describe('VendorAccessService', () => {
  let service: VendorAccessService;
  let authService: jasmine.SpyObj<AuthService>;
  let vendorDashboardService: jasmine.SpyObj<VendorDashboardService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
    vendorDashboardService = jasmine.createSpyObj<VendorDashboardService>(
      'VendorDashboardService',
      ['getVendorFirstLogin'],
    );
    authService.isLoggedIn.and.returnValue(true);
    vendorDashboardService.getVendorFirstLogin.and.returnValue(of({
      statusCode: 0,
      message: 'ok',
      messageDetails: null,
      data: {
        needsProfile: true,
        guideMessage: '請先完成攤位資料',
        name: null,
        pendingReviewCount: 0,
        pendingPaymentCount: 0,
        pendingStallSelectionCount: 0,
        notifications: [],
      },
    }));

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: VendorDashboardService, useValue: vendorDashboardService },
      ],
    });
    service = TestBed.inject(VendorAccessService);
  });

  it('should lock profile-dependent features when stall setup is required', async () => {
    expect(await service.initialize()).toBeTrue();
    expect(service.needsProfile()).toBeTrue();
  });

  it('should not check profile state for logged-out visitors', async () => {
    authService.isLoggedIn.and.returnValue(false);

    expect(await service.initialize(true)).toBeFalse();
    expect(vendorDashboardService.getVendorFirstLogin).not.toHaveBeenCalled();
  });
});
