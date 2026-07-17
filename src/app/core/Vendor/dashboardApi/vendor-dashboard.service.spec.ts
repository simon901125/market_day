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

  it('should search vendor applications with controller query parameter names', () => {
    service.searchVendorApplications({
      eventTitle: '  春日市集  ',
      status: '待付款',
      eventStartAt: '2026-07-01',
      eventEndAt: '2026-07-31',
      page: 2,
      pageSize: 6,
    }).subscribe((response) => {
      expect(response.data.applications.page).toBe(2);
    });

    // 確認前端參數名與 StallController.searchVendorApplications() 完全一致。
    const request = httpTesting.expectOne((candidate) =>
      candidate.url === `${environment.apiBaseUrl}api/vendor/applications/search`
      && candidate.params.get('eventTitle') === '春日市集'
      && candidate.params.get('status') === '待付款'
      && candidate.params.get('event_start_at') === '2026-07-01'
      && candidate.params.get('event_end_at') === '2026-07-31'
      && candidate.params.get('page') === '2'
      && candidate.params.get('pageSize') === '6',
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      statusCode: 200,
      message: '攤主報名紀錄取得成功',
      messageDetails: null,
      data: {
        totalCount: 1,
        applications: {
          items: [],
          page: 2,
          pageSize: 6,
          totalItems: 1,
          totalPages: 1,
          hasPrevious: true,
          hasNext: false,
        },
      },
    });
  });

  it('should get a vendor application detail by application id', () => {
    service.getVendorApplicationDetail(25).subscribe((response) => {
      expect(response.data.application.applicationId).toBe(25);
      expect(response.data.application.applicationNo).toBe('MD202607170025');
    });

    // 詳情端點的 path variable 是資料庫 ID，不是報名編號。
    const request = httpTesting.expectOne(
      `${environment.apiBaseUrl}api/vendor/applications/25`,
    );
    expect(request.request.method).toBe('GET');
    request.flush({
      statusCode: 200,
      message: '攤主報名詳情取得成功',
      messageDetails: null,
      data: {
        application: {
          applicationId: 25,
          applicationNo: 'MD202607170025',
          applicationStatus: '待付款',
        },
        event: {},
        vendor: {},
        brand: {},
        applicationdetail: {},
        stall: [],
        fee: {},
        refund: {},
        feedetail: [],
        equipmentRentals: {
          freeEquipments: [],
          freeBasicPower: [],
          rentalEquipments: [],
          extraPower: [],
        },
        status: [],
      },
    });
  });
});
