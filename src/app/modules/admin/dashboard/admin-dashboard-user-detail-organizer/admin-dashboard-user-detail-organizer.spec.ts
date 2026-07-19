import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardUserDetailOrganizer } from './admin-dashboard-user-detail-organizer';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AdminOrgDetailDto } from '../../../../models/interface/admin/AdminOrganizerDetail';
import { AdminUserLoginPage } from '../../../../models/interface/admin/AdminUserLoginLog';
import { UserStatusChangeDto } from '../../../../models/interface/admin/AdminUserAction';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserType } from '../../../../models/type/UserType';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';

const fakeLoginPage: AdminUserLoginPage = {
  items: [
    { loginTime: '2026/06/20 09:15', loginMethod: 'Email', loginStatus: '成功' },
  ],
  page: 1,
  pageSize: 5,
  totalItems: 6,
  totalPages: 2,
  hasPrevious: false,
  hasNext: true,
};

const fakeOrgDetail: AdminOrgDetailDto = {
  userId: 3,
  userName: '王曉三',
  role: 'organizer',
  accountStatus: 'active',
  isGoogleBound: false,
  regAt: '2020/01/01 10:00',
  lastLoginAt: '2026/06/20 09:15',
  createdEventCount: 8,
  ongoingEventCount: 2,
  endedEventCount: 6,
  organizerName: '春語市集',
  serviceHours: '週一 - 週五 09:00-18:00',
  companyName: '春語文化有限公司',
  contactPerson: '王曉三',
  contactPhone: '0912-345-678',
  contactEmail: 'wang3@example.com',
  contactAddress: '台北市大安區忠孝東路四段127號8樓',
  taxId: '12345678',
  eventLogs: {
    items: [
      { eventId: 21, eventName: '春語花市', eventDate: '2026/05/01 - 2026/05/02 10:00-19:00', eventStatus: 'ended', registrationCount: '150/150' },
    ],
    page: 1,
    pageSize: 5,
    totalItems: 9,
    totalPages: 2,
    hasPrevious: false,
    hasNext: true,
  },
  loginLogs: fakeLoginPage,
};

const fakeStatusChange: UserStatusChangeDto = {
  userName: '王曉三',
  userEmail: 'wang3@example.com',
  newAccountStatus: 'disabled',
};

describe('AdminDashboardUserDetailOrganizer', () => {
  let component: AdminDashboardUserDetailOrganizer;
  let fixture: ComponentFixture<AdminDashboardUserDetailOrganizer>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', [
      'getOrganizerDetail',
      'getOrgEventLogs',
      'getUserLoginLogs',
      'disableUserAccount',
      'restoreUserAccount',
    ]);
    adminApiServiceSpy.getOrganizerDetail.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeOrgDetail }),
    );
    adminApiServiceSpy.getOrgEventLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: { ...fakeOrgDetail.eventLogs, page: 2, hasPrevious: true, hasNext: false } }),
    );
    adminApiServiceSpy.getUserLoginLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: { ...fakeLoginPage, page: 2, hasPrevious: true, hasNext: false } }),
    );
    adminApiServiceSpy.disableUserAccount.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );
    adminApiServiceSpy.restoreUserAccount.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeStatusChange }),
    );

    alertServiceSpy = jasmine.createSpyObj('AlertService', ['confirmHtml', 'success', 'error']);
    alertServiceSpy.confirmHtml.and.resolveTo(true);
    alertServiceSpy.success.and.resolveTo({} as any);
    alertServiceSpy.error.and.resolveTo({} as any);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardUserDetailOrganizer],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '3' } } } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserDetailOrganizer);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('初始化時應依網址上的 id 呼叫 API 並轉換成畫面用的資料', () => {
    expect(adminApiServiceSpy.getOrganizerDetail).toHaveBeenCalledWith(3, component.loginPageSize);
    expect(component.detail).toEqual(jasmine.objectContaining({ userId: 3 }));
    expect(component.detail?.detail.userInfo).toEqual(jasmine.objectContaining({
      username: '王曉三',
      role: UserType.organizer,
      accountStatus: UserStatus.active,
    }));
    expect(component.detail?.detail.activityManagementRecords.items[0]).toEqual(jasmine.objectContaining({
      activityId: 21,
      activityName: '春語花市',
      activityStatus: ActivityStatus.ended,
    }));
    expect(component.activityRecordTotal).toBe(9);
    expect(component.loginRecordTotal).toBe(6);
  });

  it('onLoginPageChange 應帶入新頁碼重新查詢登入紀錄', () => {
    component.onLoginPageChange(2);

    expect(adminApiServiceSpy.getUserLoginLogs).toHaveBeenCalledWith(3, 2, component.loginPageSize);
    expect(component.loginCurrentPage).toBe(2);
  });

  it('onActivityPageChange 應帶入新頁碼重新查詢活動管理紀錄', () => {
    component.onActivityPageChange(2);

    expect(adminApiServiceSpy.getOrgEventLogs).toHaveBeenCalledWith(3, 2, component.activityPageSize);
    expect(component.activityCurrentPage).toBe(2);
  });

  it('onViewActivity 應帶入活動 id 導向活動詳細頁', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onViewActivity(component.detail!.detail.activityManagementRecords.items[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dash-board/activity/detail', 21]);
  });

  it('goBack 應導向使用者管理列表頁', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dash-board/users']);
  });

  it('toggleAccountStatus 取消確認時不應呼叫 API', async () => {
    alertServiceSpy.confirmHtml.and.resolveTo(false);

    await component.toggleAccountStatus();

    expect(adminApiServiceSpy.disableUserAccount).not.toHaveBeenCalled();
  });

  it('toggleAccountStatus 確認停用後應呼叫 disableUserAccount 並重新載入詳細資料', async () => {
    await component.toggleAccountStatus();

    expect(adminApiServiceSpy.disableUserAccount).toHaveBeenCalledWith(3);
    expect(alertServiceSpy.success).toHaveBeenCalled();
    expect(adminApiServiceSpy.getOrganizerDetail).toHaveBeenCalledTimes(2);
  });
});
