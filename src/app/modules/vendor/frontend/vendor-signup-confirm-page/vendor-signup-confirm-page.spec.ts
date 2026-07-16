import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { environment } from '../../../../../environments/environment';

import { VendorSignupConfirmPage } from './vendor-signup-confirm-page';

describe('VendorSignupConfirmPage', () => {
  let component: VendorSignupConfirmPage;
  let fixture: ComponentFixture<VendorSignupConfirmPage>;
  let httpTesting: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupConfirmPage],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSignupConfirmPage);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the application and navigate only after API success', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.signup = {
      slot: { date: '05/30', remaining: 10 },
      slotDate: '05/30',
      selectedSlots: [{ date: '05/30', remaining: 10 }],
      categories: [],
      formData: {
        powerUsage: '無',
        vehicleNumber: '無',
        note: '',
        rentPower: false,
        hasVehicle: false,
      },
      boothSpec: '3 × 3 公尺',
      boothFee: 650,
      boothDeposit: 0,
      powerRentalFee: 0,
      totalFee: 650,
      applicationRequest: {
        eventId: 1,
        applyDates: ['2026-05-30'],
        vehicleNo: null,
        applicantNote: null,
        equipmentRentals: [],
      },
    };

    component.submitApplication();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}api/vendor/applications`);
    expect(request.request.method).toBe('POST');
    expect(navigateSpy).not.toHaveBeenCalled();
    request.flush({
      statusCode: 200,
      message: '活動報名送出成功',
      messageDetails: null,
      data: {
        applicationId: 10,
        applicationNo: 'MD202605300001',
        eventId: 1,
        eventTitle: '測試市集',
        applicationStatus: '待審核',
        reviewStatus: 'PENDING',
        paymentStatus: 'PENDING',
        applyDates: ['2026-05-30'],
        applicationFee: 650,
        equipmentTotal: 0,
        depositAmount: 0,
        totalAmount: 650,
        paymentDueAt: '2026-05-18T12:00:00',
        equipmentRentals: [],
      },
    });

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/vendor/sign-up-complete'],
      jasmine.objectContaining({
        state: jasmine.objectContaining({
          application: jasmine.objectContaining({ applicationNo: 'MD202605300001' }),
        }),
      }),
    );
  });
});
