import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlertService } from '../../../../core/services/alert.service';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { VendorPaymentPage } from './vendor-payment-page';

describe('VendorPaymentPage', () => {
  let component: VendorPaymentPage;
  let fixture: ComponentFixture<VendorPaymentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPaymentPage],
      providers: [
        provideRouter([]),
        { provide: AlertService, useValue: {} },
        { provide: VendorDashboardService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should restore the payment button when returning from NewebPay', () => {
    component.isSubmitting = true;

    window.dispatchEvent(new Event('pageshow'));
    fixture.detectChanges();

    expect(component.isSubmitting).toBeFalse();
  });

  it('should use the shared market status class on the payment page', () => {
    expect(component.marketStatus.getClass('即將開始')).toBe('upcoming');
    expect(component.marketStatus.getClass('已結束')).toBe('ended');
  });
});
