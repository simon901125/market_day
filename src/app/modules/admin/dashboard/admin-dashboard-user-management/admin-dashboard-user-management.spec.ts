import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardUserManagement } from './admin-dashboard-user-management';
import { UserStatus } from '../../../../models/status/UserStatus';
import { UserType } from '../../../../models/type/UserType';
import { AdminUserPage } from '../../../../models/interface/admin/AdminUserSearch';
import { AdminApiService } from '../../../../core/services/admin-api.service';

const fakeUserPage: AdminUserPage = {
  items: [
    {
      id: 1,
      role: 'organizer',
      name: '森林生活市集',
      status: 'active',
      email: 'forest@marketday.com',
      regAt: '2020/01/01 00:00',
      lastLoginAt: '2026/05/30 09:00',
    },
    {
      id: 2,
      role: 'vender',
      name: '王曉二',
      status: 'disabled',
      email: 'test@gmail.com',
      regAt: '2020/01/01 00:00',
      lastLoginAt: '2024/05/30 09:00',
    },
  ],
  page: 1,
  pageSize: 6,
  totalItems: 2,
  totalPages: 1,
  hasPrevious: false,
  hasNext: false,
};

describe('AdminDashboardUserManagement', () => {
  let component: AdminDashboardUserManagement;
  let fixture: ComponentFixture<AdminDashboardUserManagement>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['searchUsers']);
    adminApiServiceSpy.searchUsers.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeUserPage }),
    );

    await TestBed.configureTestingModule({
      imports: [AdminDashboardUserManagement],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserManagement);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();

    component.tableWrapperRef = { nativeElement: document.createElement('div') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getRoleClass/getStatusClass 應回傳對應的顏色 class', () => {
    expect(component.getRoleClass(UserType.organizer)).toBe('blue');
    expect(component.getRoleClass(UserType.vendor)).toBe('purple');
    expect(component.getStatusClass(UserStatus.active)).toBe('green');
    expect(component.getStatusClass(UserStatus.disabled)).toBe('red');
  });

  it('搜尋時應把關鍵字帶入查詢條件，並套用 API 回傳結果', () => {
    component.searchKeyword = '森林';
    component.onSearch();

    expect(adminApiServiceSpy.searchUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({ keyWord: '森林', pageNumber: 1 }),
    );
    expect(component.totalItems).toBe(2);
    expect(component.users.length).toBe(2);
    expect(component.users[0]).toEqual(jasmine.objectContaining({
      id: 1,
      name: '森林生活市集',
      role: UserType.organizer,
      status: UserStatus.active,
      createdAt: '2020/01/01 00:00',
      lastLoginAt: '2026/05/30 09:00',
    }));
    expect(component.users[1]).toEqual(jasmine.objectContaining({
      id: 2,
      role: UserType.vendor,
      status: UserStatus.disabled,
    }));
  });

  it('選擇角色後搜尋，應把角色轉成後端 API 值帶入查詢條件', () => {
    component.onRoleSelected(UserType.organizer);
    component.onSearch();

    expect(adminApiServiceSpy.searchUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({ role: 'organizer' }),
    );
  });

  it('選擇帳號狀態後搜尋，應把狀態轉成後端 API 值帶入查詢條件', () => {
    component.onStatusSelected(UserStatus.disabled);
    component.onSearch();

    expect(adminApiServiceSpy.searchUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: 'disabled' }),
    );
  });

  it('onPageChange 應帶入新的頁碼重新查詢', () => {
    component.onSearch();
    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
    expect(adminApiServiceSpy.searchUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({ pageNumber: 3 }),
    );
  });

  it('getDetailHandler 導向主辦方時應帶入 organizer 詳細頁路徑', () => {
    component.onSearch();
    const user = component.users[0];
    const navigateSpy = spyOn(router, 'navigate');

    component.getDetailHandler(user)();

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/admin/dash-board/user/detail/organizer', user.id],
      { state: { user } },
    );
  });

  it('getDetailHandler 導向攤主時應帶入 vender 詳細頁路徑', () => {
    component.onSearch();
    const user = component.users[1];
    const navigateSpy = spyOn(router, 'navigate');

    component.getDetailHandler(user)();

    expect(navigateSpy).toHaveBeenCalledWith(
      ['/admin/dash-board/user/detail/vender', user.id],
      { state: { user } },
    );
  });

  it('formatDateTime 應統一顯示為 yyyy/MM/dd HH:mm', () => {
    expect(component.formatDateTime('2026/05/28 14:30')).toBe('2026/05/28 14:30');
  });
});
