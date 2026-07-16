import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import { VendorDashboardService } from './vendor-dashboard.service';

describe('VendorDashboardService', () => {
  let service: VendorDashboardService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VendorDashboardService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get vendor dashboard initialization state', () => {
    service.getVendorFirstLogin().subscribe((response) => {
      expect(response.data.needsProfile).toBeTrue();
    });

    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}api/vendor/dashboard/init`,
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      statusCode: 200,
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
    });
  });
});
