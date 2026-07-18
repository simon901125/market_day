import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardMarketDetail } from './admin-dashboard-market-detail';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AdminEventDetailDto, AdminEventStatusLogPage } from '../../../../models/interface/admin/AdminEventDetail';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';

const fakeLogsPage: AdminEventStatusLogPage = {
  items: [
    {
      dateTime: '2026/06/20 10:15',
      status: 'pendingReview',
      description: '主辦方已送出活動申請，等待審核。',
      operatorRole: 'organizer',
      operator: '森林生活市集（林子庭）',
    },
  ],
  page: 1,
  pageSize: 5,
  totalItems: 6,
  totalPages: 2,
  hasPrevious: false,
  hasNext: true,
};

const fakeEventDetail: AdminEventDetailDto = {
  eventId: 1,
  coverImg: 'assets/images/market/cards/market-card-01.png',
  eventName: '夏日綠意市集',
  locationName: '勤美綠原道',
  addr: '台北市信義區君悅大道1號',
  eventStatus: 'pendingReview',
  eventType: '文創手作',
  description: '夏天市集介紹',
  registrationStartTime: '2026/05/01 10:00',
  registrationEndTime: '2026/05/15 23:59',
  finalListCfmTime: '2026/05/29 12:00',
  eventTime: '2026/07/01 - 2026/07/02 10:00-19:00',
  organizerName: '森林生活市集',
  taxId: '98765432',
  serviceHours: '週一 - 週五 09:00-18:00',
  contactPerson: '林子庭',
  contactPhone: '0912-345-678',
  contactEmail: 'forest@marketday.com',
  contactAddr: '台北市大安區忠孝東路四段127號8樓',
  mrt: '捷運忠孝3號出口步行5分鐘',
  bus: '藍5・紅12・北新幹線',
  driving: '市政府地下停車場（步行約6分鐘）',
  boothSpec: '3 * 3',
  boothCount: 90,
  boothPrice: 2500,
  boothZones: [
    { name: 'A區', qty: 50 },
    { name: 'B區', qty: 20 },
  ],
  boothLayoutImage: 'assets/images/organizer/booth/booth-layout-example.svg',
  unpublishRequestId: null,
  unpublishReason: null,
  logs: fakeLogsPage,
};

describe('AdminDashboardMarketDetail', () => {
  let component: AdminDashboardMarketDetail;
  let fixture: ComponentFixture<AdminDashboardMarketDetail>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['getEventDetail', 'getEventStatusLogs']);
    adminApiServiceSpy.getEventDetail.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeEventDetail }),
    );
    adminApiServiceSpy.getEventStatusLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: { ...fakeLogsPage, page: 2, hasPrevious: true, hasNext: false } }),
    );

    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketDetail],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMarketDetail);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('初始化時應依網址上的 id 呼叫 API 並轉換成畫面用的資料', () => {
    expect(adminApiServiceSpy.getEventDetail).toHaveBeenCalledWith(1);
    expect(component.detail).toEqual(jasmine.objectContaining({
      activityId: 1,
      activityStatus: ActivityStatus.pendingReview,
    }));
    expect(component.detail?.activityInfo).toEqual(jasmine.objectContaining({
      image: 'assets/images/market/cards/market-card-01.png',
      name: '夏日綠意市集',
      type: '文創手作',
    }));
    expect(component.detail?.organizerInfo.email).toBe('forest@marketday.com');
    expect(component.detail?.boothInfo.boothZones).toEqual(['A區：50攤', 'B區：20攤']);
    expect(component.statusLogTotalItems).toBe(6);
  });

  it('狀態紀錄應把後端角色/狀態轉成中文顯示', () => {
    const log = component.detail?.statusLogs[0];
    expect(log?.status).toBe(ActivityStatus.pendingReview);
    expect(log?.operator).toEqual({ role: '主辦方', operatorName: '森林生活市集（林子庭）' });
  });

  it('onStatusLogPageChange 應帶入新頁碼重新查詢狀態紀錄', () => {
    component.onStatusLogPageChange(2);

    expect(adminApiServiceSpy.getEventStatusLogs).toHaveBeenCalledWith(1, 2, component.statusLogPageSize);
    expect(component.statusLogCurrentPage).toBe(2);
  });

  it('goBack 應導向活動管理列表頁', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dash-board/activity']);
  });
});
