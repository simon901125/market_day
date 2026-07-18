import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardMarketDetail } from './admin-dashboard-market-detail';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AdminEventDetailDto, AdminEventStatusLogPage } from '../../../../models/interface/admin/AdminEventDetail';
import { EventStatusChangeDto } from '../../../../models/interface/admin/AdminEventAction';
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
  unpublishRequestedAt: null,
  logs: fakeLogsPage,
};

const fakeStatusChange: EventStatusChangeDto = {
  eventName: '夏日綠意市集',
  newEventStatus: 'mapBuilding',
};

describe('AdminDashboardMarketDetail', () => {
  let component: AdminDashboardMarketDetail;
  let fixture: ComponentFixture<AdminDashboardMarketDetail>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', [
      'getEventDetail',
      'getEventStatusLogs',
      'approveEvent',
      'requestEventRevision',
      'completeEventMapBuilding',
      'confirmEventUnpublish',
    ]);
    adminApiServiceSpy.getEventDetail.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeEventDetail }),
    );
    adminApiServiceSpy.getEventStatusLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: { ...fakeLogsPage, page: 2, hasPrevious: true, hasNext: false } }),
    );
    adminApiServiceSpy.approveEvent.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );
    adminApiServiceSpy.requestEventRevision.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );
    adminApiServiceSpy.completeEventMapBuilding.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );
    adminApiServiceSpy.confirmEventUnpublish.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['confirm', 'success', 'error', 'custom']);
    alertServiceSpy.confirm.and.resolveTo(true);
    alertServiceSpy.success.and.resolveTo({} as any);
    alertServiceSpy.error.and.resolveTo({} as any);
    alertServiceSpy.custom.and.resolveTo({ isConfirmed: false } as any);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketDetail],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
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

  it('onApproveHandler 取消確認時不應呼叫 API', async () => {
    alertServiceSpy.confirm.and.resolveTo(false);

    await component.onApproveHandler();

    expect(adminApiServiceSpy.approveEvent).not.toHaveBeenCalled();
  });

  it('onApproveHandler 確認後應呼叫 approveEvent 並重新載入詳細資料', async () => {
    await component.onApproveHandler();

    expect(adminApiServiceSpy.approveEvent).toHaveBeenCalledWith(1);
    expect(alertServiceSpy.success).toHaveBeenCalled();
    expect(adminApiServiceSpy.getEventDetail).toHaveBeenCalledTimes(2);
  });

  it('onMapBuildingDoneHandler 確認後應呼叫 completeEventMapBuilding', async () => {
    await component.onMapBuildingDoneHandler();

    expect(adminApiServiceSpy.completeEventMapBuilding).toHaveBeenCalledWith(1);
    expect(alertServiceSpy.success).toHaveBeenCalled();
  });

  it('onRequireSupplementHandler 送出補件原因後應帶 isUnpublish:false 呼叫 requestEventRevision', async () => {
    alertServiceSpy.custom.and.resolveTo({ isConfirmed: true, value: '資料不齊全' } as any);

    await component.onRequireSupplementHandler();

    expect(adminApiServiceSpy.requestEventRevision).toHaveBeenCalledWith(1, {
      note: '資料不齊全',
      isUnpublish: false,
    });
  });

  it('下架駁回時找不到下架申請單 id 應顯示錯誤，不呼叫 API', async () => {
    alertServiceSpy.custom.and.resolveTo({
      isConfirmed: true,
      value: { approved: false, reason: '資料不齊全' },
    } as any);

    await component.onUnpublishHandler();

    expect(adminApiServiceSpy.requestEventRevision).not.toHaveBeenCalled();
    expect(alertServiceSpy.error).toHaveBeenCalledWith('下架審核失敗', '找不到下架申請單，請重新整理頁面。');
  });

  it('下架駁回時應帶下架申請單 id 與 isUnpublish:true 呼叫 requestEventRevision', async () => {
    adminApiServiceSpy.getEventDetail.and.returnValue(of({
      statusCode: 200,
      message: 'ok',
      messageDetails: null,
      data: { ...fakeEventDetail, eventStatus: 'pendingUnpublish', unpublishRequestId: 42, unpublishReason: '主辦方申請下架', unpublishRequestedAt: '2026/06/25 09:00' },
    }));
    component.ngOnInit();

    alertServiceSpy.custom.and.resolveTo({
      isConfirmed: true,
      value: { approved: false, reason: '資料不齊全' },
    } as any);

    await component.onUnpublishHandler();

    expect(adminApiServiceSpy.requestEventRevision).toHaveBeenCalledWith(42, {
      note: '資料不齊全',
      isUnpublish: true,
    });
  });

  it('下架同意時應呼叫 confirmEventUnpublish', async () => {
    adminApiServiceSpy.getEventDetail.and.returnValue(of({
      statusCode: 200,
      message: 'ok',
      messageDetails: null,
      data: { ...fakeEventDetail, eventStatus: 'pendingUnpublish', unpublishRequestId: 42, unpublishReason: '主辦方申請下架', unpublishRequestedAt: '2026/06/25 09:00' },
    }));
    component.ngOnInit();

    alertServiceSpy.custom.and.resolveTo({
      isConfirmed: true,
      value: { approved: true, reason: '' },
    } as any);

    await component.onUnpublishHandler();

    expect(adminApiServiceSpy.confirmEventUnpublish).toHaveBeenCalledWith(1);
  });
});
