import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { VendorDashboardHome } from './vendor-dashboard-home';

describe('VendorDashboardHome', () => {
  let component: VendorDashboardHome;
  let fixture: ComponentFixture<VendorDashboardHome>;
  let vendorDashboardService: jasmine.SpyObj<VendorDashboardService>;

  beforeEach(async () => {
    vendorDashboardService = jasmine.createSpyObj<VendorDashboardService>(
      'VendorDashboardService',
      ['getVendorFirstLogin'],
    );
    vendorDashboardService.getVendorFirstLogin.and.returnValue(of({
      statusCode: 0,
      message: 'ok',
      messageDetails: null,
      data: { needsProfileSetup: true },
    }));

    await TestBed.configureTestingModule({
      imports: [VendorDashboardHome],
      providers: [
        { provide: VendorDashboardService, useValue: vendorDashboardService },
        { provide: AuthService, useValue: { getUser: () => null } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show first-login guide when profile setup is required', () => {
    expect(component.hasRecords).toBeFalse();
    expect(vendorDashboardService.getVendorFirstLogin).toHaveBeenCalled();
  });
});
