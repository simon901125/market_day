import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardMarketManagement } from './admin-dashboard-market-management';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ActivityListItem } from '../../../../models/interface/admin/ActivityListItem';
import { AdminEventPage } from '../../../../models/interface/admin/AdminEventSearch';
import { AdminApiService } from '../../../../core/services/admin-api.service';

const fakeEventPage: AdminEventPage = {
  items: [
    {
      id: 1,
      imgUrl: 'assets/images/market/cards/market-card-01.png',
      event: '測試市集A',
      date: '2026/07/01 - 2026/07/02',
      status: 'pendingReview',
      organizer: '森林生活市集',
      reviewTime: '2026/05/28 14:30',
    },
    {
      id: 2,
      imgUrl: 'assets/images/market/cards/market-card-02.png',
      event: '測試市集B',
      date: '2026/09/15 - 2026/09/16',
      status: 'registrationOpen',
      organizer: '日日好市',
      reviewTime: '活動尚未送審',
    },
  ],
  page: 1,
  pageSize: 6,
  totalItems: 2,
  totalPages: 1,
  hasPrevious: false,
  hasNext: false,
};

describe('AdminDashboardMarketManagement', () => {
  let component: AdminDashboardMarketManagement;
  let fixture: ComponentFixture<AdminDashboardMarketManagement>;
  let router: Router;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['searchEvents']);
    adminApiServiceSpy.searchEvents.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeEventPage }),
    );

    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketManagement],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMarketManagement);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();

    component.timeSelectorRef = { getTimeRange: () => ({ startDate: null, endDate: null }), reset: () => {} } as any;
    component.organizerDropdownRef = { reset: () => {} } as any;
    component.statusDropdownRef = { reset: () => {} } as any;
    component.tableWrapperRef = { nativeElement: document.createElement('div') } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getStatusClass 應回傳對應的顏色 class', () => {
    expect(component.getStatusClass(ActivityStatus.pendingReview)).toBe('tag-orange');
    expect(component.getStatusClass(ActivityStatus.revisionRequired)).toBe('tag-red');
    expect(component.getStatusClass(ActivityStatus.mapBuilding)).toBe('tag-blue');
    expect(component.getStatusClass(ActivityStatus.readyToPublish)).toBe('tag-purple');
    expect(component.getStatusClass(ActivityStatus.registrationOpen)).toBe('tag-green');
    expect(component.getStatusClass(ActivityStatus.full)).toBe('tag-orange');
    expect(component.getStatusClass(ActivityStatus.published)).toBe('tag-teal');
    expect(component.getStatusClass(ActivityStatus.active)).toBe('tag-blue');
    expect(component.getStatusClass(ActivityStatus.ended)).toBe('tag-grey');
    expect(component.getStatusClass(ActivityStatus.unpublished)).toBe('tag-red');
  });

  it('isReviewNeeded 對待審核/地圖建置中/下架申請中回傳 true，其餘回傳 false', () => {
    expect(component.isReviewNeeded(ActivityStatus.pendingReview)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.mapBuilding)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.unpublishRequested)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.revisionRequired)).toBeFalse();
    expect(component.isReviewNeeded(ActivityStatus.registrationOpen)).toBeFalse();
    expect(component.isReviewNeeded(ActivityStatus.full)).toBeFalse();
    expect(component.isReviewNeeded(ActivityStatus.ended)).toBeFalse();
  });

  it('搜尋時應把關鍵字帶入查詢條件，並套用 API 回傳結果', () => {
    component.searchKeyword = '咖啡';
    component.onSearch();

    expect(adminApiServiceSpy.searchEvents).toHaveBeenCalledWith(
      jasmine.objectContaining({ keyword: '咖啡', pageNumber: 1 }),
    );
    expect(component.totalItems).toBe(2);
    expect(component.activities.length).toBe(2);
    expect(component.activities[0]).toEqual(jasmine.objectContaining({
      id: 1,
      image: 'assets/images/market/cards/market-card-01.png',
      name: '測試市集A',
      organizer: '森林生活市集',
      startDate: '2026/07/01',
      endDate: '2026/07/02',
      status: ActivityStatus.pendingReview,
      submittedAt: '2026/05/28 14:30',
    }));
  });

  it('選擇主辦方後搜尋，應把主辦方帶入查詢條件', () => {
    component.onOrganizerSelected('森林生活市集');
    component.onSearch();

    expect(adminApiServiceSpy.searchEvents).toHaveBeenCalledWith(
      jasmine.objectContaining({ organizer: '森林生活市集' }),
    );
  });

  it('選擇狀態後搜尋，應把狀態轉成後端 API 值帶入查詢條件', () => {
    component.onStatusSelected(ActivityStatus.pendingReview);
    component.onSearch();

    expect(adminApiServiceSpy.searchEvents).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: 'pendingReview' }),
    );
  });

  it('onPageChange 應帶入新的頁碼重新查詢', () => {
    component.onSearch();
    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
    expect(adminApiServiceSpy.searchEvents).toHaveBeenCalledWith(
      jasmine.objectContaining({ pageNumber: 3 }),
    );
  });

  it('getDetailHandler 回傳的函式應導向活動詳細頁並帶入該筆活動資料', () => {
    component.onSearch();
    const activity = component.activities[0];
    const navigateSpy = spyOn(router, 'navigate');

    component.getDetailHandler(activity)();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dash-board/activity/detail', activity.id], { state: { activity } });
  });

  it('recalculatePageSize() 應固定每頁顯示 6 筆', () => {
    const wrapperEl: HTMLElement = component.tableWrapperRef.nativeElement;
    Object.defineProperty(wrapperEl, 'clientHeight', { value: 280, configurable: true });

    (component as any).recalculatePageSize();

    expect(component.pageSize).toBe(6);
  });

  it('recalculatePageSize() 不受容器高度影響', () => {
    const wrapperEl: HTMLElement = component.tableWrapperRef.nativeElement;
    Object.defineProperty(wrapperEl, 'clientHeight', { value: 10, configurable: true });

    (component as any).recalculatePageSize();

    expect(component.pageSize).toBe(6);
  });

  it('應顯示頁面標題「活動管理」', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('活動管理');
  });

  it('表格應依 activities 渲染對應列數，並顯示正確的狀態樣式與操作按鈕文字', () => {
    component.activities = [
      { id: 1, image: 'assets/images/market/cards/market-card-01.png', name: '測試市集A', organizer: '森林生活市集', startDate: '2026-07-01', endDate: '2026-07-02', status: ActivityStatus.pendingReview, submittedAt: '2026-05-28 14:30' },
      { id: 2, image: 'assets/images/market/cards/market-card-02.png', name: '測試市集B', organizer: '日日好市', startDate: '2026-09-15', endDate: '2026-09-16', status: ActivityStatus.registrationOpen, submittedAt: '2026-05-27 10:00' },
    ];
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector('.tag-orange')?.textContent).toContain(ActivityStatus.pendingReview);
    expect(rows[0].querySelector('td:last-child .app-btn.primary')?.textContent?.trim()).toBe('審核');
    expect(rows[1].querySelector('.tag-green')?.textContent).toContain(ActivityStatus.registrationOpen);
    expect(rows[1].querySelector('td:last-child .app-btn.primary')).toBeNull();
    expect(rows[1].querySelector('td:last-child .app-btn.secondary')?.textContent?.trim()).toBe('查看');
  });

  it('activities 為空時，應顯示查無資料的提示列', () => {
    component.activities = [];
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const emptyCell = el.querySelector('tbody tr.empty-row td');
    expect(emptyCell?.textContent).toContain('目前沒有活動資料');
  });

  it('formatDateTime 對後端「活動尚未送審」等純文字提示應原樣顯示', () => {
    expect(component.formatDateTime('活動尚未送審')).toBe('活動尚未送審');
    expect(component.formatDateTime('2026/05/28 14:30')).toBe('2026/05/28 14:30');
  });
});
