import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardLogs } from './admin-dashboard-logs';
import { OperationType } from '../../../../models/type/OperationType';
import { LogTargetType } from '../../../../models/type/LogTargetType';
import { AdminLogPage } from '../../../../models/interface/admin/AdminLogSearch';
import { AdminApiService } from '../../../../core/services/admin-api.service';

const fakeLogPage: AdminLogPage = {
  items: [
    {
      id: 1,
      operator: '管理員A',
      operationType: 'activityReview',
      targetType: 'organizer',
      targetName: '森林生活市集',
      email: 'forest@marketday.com',
      createdAt: '2026/06/01 10:00',
      content: '審核通過活動申請',
    },
    {
      id: 2,
      operator: '管理員A',
      operationType: 'systemSetting',
      targetType: 'systemSetting',
      targetName: '系統設定',
      email: null,
      createdAt: '2026/06/02 11:00',
      content: '調整系統參數',
    },
  ],
  page: 1,
  pageSize: 6,
  totalItems: 2,
  totalPages: 1,
  hasPrevious: false,
  hasNext: false,
};

describe('AdminDashboardLogs', () => {
  let component: AdminDashboardLogs;
  let fixture: ComponentFixture<AdminDashboardLogs>;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['searchLogs']);
    adminApiServiceSpy.searchLogs.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeLogPage }),
    );

    await TestBed.configureTestingModule({
      imports: [AdminDashboardLogs],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.timeSelectorRef = { getTimeRange: () => ({ startDate: null, endDate: null }), reset: () => {} } as any;
    component.tableWrapperRef = { nativeElement: document.createElement('div') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getOperationClass/getTargetRoleClass 應回傳對應的顏色 class', () => {
    expect(component.getOperationClass(OperationType.activityReview)).toBe('admin-blue');
    expect(component.getOperationClass(OperationType.mapBuildCompleted)).toBe('admin-teal');
    expect(component.getOperationClass(OperationType.eventUnpublishReview)).toBe('admin-yellow');
    expect(component.getTargetRoleClass(LogTargetType.organizer)).toBe('organizer');
    expect(component.getTargetRoleClass(LogTargetType.system)).toBe('system');
    expect(component.getTargetRoleClass(LogTargetType.event)).toBe('event');
  });

  it('搜尋時應把關鍵字帶入查詢條件，並套用 API 回傳結果', () => {
    component.searchKeyword = '森林';
    component.onSearch();

    expect(adminApiServiceSpy.searchLogs).toHaveBeenCalledWith(
      jasmine.objectContaining({ keyWord: '森林', pageNumber: 1 }),
    );
    expect(component.totalItems).toBe(2);
    expect(component.logs.length).toBe(2);
    expect(component.logs[0]).toEqual(jasmine.objectContaining({
      id: 1,
      operator: '管理員A',
      actionType: OperationType.activityReview,
      target: '森林生活市集',
      targetRole: LogTargetType.organizer,
      targetEmail: 'forest@marketday.com',
      details: '審核通過活動申請',
    }));
    expect(component.logs[1]).toEqual(jasmine.objectContaining({
      id: 2,
      actionType: OperationType.systemSetting,
      targetRole: LogTargetType.system,
      targetEmail: '-',
    }));
  });

  it('選擇操作類型後搜尋，應把類型轉成後端 API 值帶入查詢條件', () => {
    component.onOperationSelected(OperationType.mapBuildCompleted);
    component.onSearch();

    expect(adminApiServiceSpy.searchLogs).toHaveBeenCalledWith(
      jasmine.objectContaining({ operationType: 'mapBuildCompleted' }),
    );
  });

  it('選擇對象角色後搜尋，應把角色轉成後端 API 值帶入查詢條件', () => {
    component.onTargetRoleSelected(LogTargetType.system);
    component.onSearch();

    expect(adminApiServiceSpy.searchLogs).toHaveBeenCalledWith(
      jasmine.objectContaining({ targetType: 'systemSetting' }),
    );
  });

  it('onPageChange 應帶入新的頁碼重新查詢', () => {
    component.onSearch();
    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
    expect(adminApiServiceSpy.searchLogs).toHaveBeenCalledWith(
      jasmine.objectContaining({ pageNumber: 3 }),
    );
  });

  it('formatDateTime 應統一顯示為 yyyy/MM/dd HH:mm', () => {
    expect(component.formatDateTime('2026/06/01 10:00')).toBe('2026/06/01 10:00');
  });
});
