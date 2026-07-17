import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { VendorApplicationRecord } from './vendor-application-record';

describe('VendorApplicationRecord', () => {
  let component: VendorApplicationRecord;
  let fixture: ComponentFixture<VendorApplicationRecord>;
  let dashboardService: jasmine.SpyObj<VendorDashboardService>;

  beforeEach(async () => {
    // 以可觀察的假 service 驗證元件初始化時的 API 查詢條件。
    dashboardService = jasmine.createSpyObj<VendorDashboardService>('VendorDashboardService', [
      'searchVendorApplications',
    ]);
    dashboardService.searchVendorApplications.and.returnValue(of({
      statusCode: 200,
      message: '攤主報名紀錄取得成功',
      messageDetails: null,
      data: {
        totalCount: 0,
        applications: {
          items: [],
          page: 1,
          pageSize: 6,
          totalItems: 0,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
        },
      },
    }));

    await TestBed.configureTestingModule({
      imports: [VendorApplicationRecord],
      providers: [
        provideRouter([]),
        { provide: VendorDashboardService, useValue: dashboardService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorApplicationRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(dashboardService.searchVendorApplications).toHaveBeenCalledWith({
      eventTitle: '',
      status: undefined,
      eventStartAt: undefined,
      eventEndAt: undefined,
      page: 1,
      pageSize: 6,
    });
  });
});
