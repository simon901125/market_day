import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardUserDetailVender } from './admin-dashboard-user-detail-vender';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { AdminVenderDetailDto } from '../../../../models/interface/admin/AdminVendorDetail';
import { AdminUserLoginPage } from '../../../../models/interface/admin/AdminUserLoginLog';
import { UserStatusChangeDto } from '../../../../models/interface/admin/AdminUserAction';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserType } from '../../../../models/type/UserType';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';
import { PaymentStatus } from '../../../../models/status/PaymentStatus';

const fakeLoginPage: AdminUserLoginPage = {
  items: [
    { loginTime: '2026/06/20 14:30', loginMethod: 'Email', loginStatus: '成功' },
  ],
  page: 1,
  pageSize: 5,
  totalItems: 6,
  totalPages: 2,
  hasPrevious: false,
  hasNext: true,
};

const fakeVenderDetail: AdminVenderDetailDto = {
  userId: 1,
  userName: '李小花',
  role: 'vender',
  accountStatus: 'active',
  isGoogleBound: true,
  regAt: '2021/03/15 10:00',
  lastLoginAt: '2026/06/20 14:30',
  ongoingEventCount: 1,
  endedEventCount: 3,
  brandName: '小花手作',
  brandType: '手作',
  owner: '李小花',
  contactPhone: '0912-111-222',
  contactEmail: 'flower@example.com',
  contactAddress: '台中市西區民生路100號',
  eventRegLogs: {
    items: [
      {
        eventId: 21,
        eventName: '春語花市',
        regStatus: '報名完成',
        paymentStatus: 'paid',
        regBooths: [{ regDate: '2026/05/01', boothNo: 'A01' }, { regDate: '2026/05/02', boothNo: 'A02' }],
      },
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
  userName: '李小花',
  userEmail: 'flower@example.com',
  newAccountStatus: 'disabled',
};

describe('AdminDashboardUserDetailVender', () => {
  let component: AdminDashboardUserDetailVender;
  let fixture: ComponentFixture<AdminDashboardUserDetailVender>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', [
      'getVenderDetail',
      'getVenderRegLogs',
      'getUserLoginLogs',
      'disableUserAccount',
      'restoreUserAccount',
    ]);
    adminApiServiceSpy.getVenderDetail.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeVenderDetail }),
    );
    adminApiServiceSpy.getVenderRegLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: { ...fakeVenderDetail.eventRegLogs, page: 2, hasPrevious: true, hasNext: false } }),
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
      imports: [AdminDashboardUserDetailVender],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserDetailVender);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('初始化時應依網址上的 id 呼叫 API 並轉換成畫面用的資料', () => {
    expect(adminApiServiceSpy.getVenderDetail).toHaveBeenCalledWith(1, component.loginPageSize);
    expect(component.detail).toEqual(jasmine.objectContaining({ userId: 1 }));
    expect(component.detail?.detail.userInfo).toEqual(jasmine.objectContaining({
      username: '李小花',
      role: UserType.vendor,
      accountStatus: UserStatus.active,
      registrationCount: 1,
      completedEventCount: 3,
    }));
    expect(component.registrationRecordTotal).toBe(9);
    expect(component.loginRecordTotal).toBe(6);
  });

  it('活動報名紀錄應把後端付款狀態轉成中文、攤位與報名日期正確轉換', () => {
    const record = component.detail?.detail.activityRegistrationRecords.items[0];
    expect(record?.activityId).toBe(21);
    expect(record?.registrationStatus).toBe('報名完成');
    expect(record?.paymentStatus).toBe(PaymentStatus.paid);
    expect(record?.booths).toEqual([
      { date: '2026/05/01', code: 'A01' },
      { date: '2026/05/02', code: 'A02' },
    ]);
    expect(record?.registrationDates).toEqual(['2026/05/01', '2026/05/02']);
  });

  it('getRegistrationStatusClass/getPaymentStatusClass 應回傳對應的顏色 class', () => {
    expect(component.getRegistrationStatusClass(ApplicationStatus.completed)).toBe('tag-green');
    expect(component.getPaymentStatusClass(PaymentStatus.paid)).toBe('tag-green');
  });

  it('onLoginPageChange 應帶入新頁碼重新查詢登入紀錄', () => {
    component.onLoginPageChange(2);

    expect(adminApiServiceSpy.getUserLoginLogs).toHaveBeenCalledWith(1, 2, component.loginPageSize);
    expect(component.loginCurrentPage).toBe(2);
  });

  it('onRegistrationPageChange 應帶入新頁碼重新查詢活動報名紀錄', () => {
    component.onRegistrationPageChange(2);

    expect(adminApiServiceSpy.getVenderRegLogs).toHaveBeenCalledWith(1, 2, component.registrationPageSize);
    expect(component.registrationCurrentPage).toBe(2);
  });

  it('onViewRecord 應帶入活動 id 導向活動詳細頁', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onViewRecord(component.detail!.detail.activityRegistrationRecords.items[0]);
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

    expect(adminApiServiceSpy.disableUserAccount).toHaveBeenCalledWith(1);
    expect(alertServiceSpy.success).toHaveBeenCalled();
    expect(adminApiServiceSpy.getVenderDetail).toHaveBeenCalledTimes(2);
  });
});
