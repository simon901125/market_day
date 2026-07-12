import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { AdminDashboardMarketManagement } from './admin-dashboard-market-management';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ActivityListItem } from '../../../../models/interface/admin/ActivityListItem';

describe('AdminDashboardMarketManagement', () => {
  let component: AdminDashboardMarketManagement;
  let fixture: ComponentFixture<AdminDashboardMarketManagement>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketManagement],
      providers: [provideRouter([])],
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
    expect(component.getStatusClass(ActivityStatus.pendingReview)).toBe('orange');
    expect(component.getStatusClass(ActivityStatus.revisionRequired)).toBe('red');
    expect(component.getStatusClass(ActivityStatus.mapBuilding)).toBe('yellow');
    expect(component.getStatusClass(ActivityStatus.readyToPublish)).toBe('blue');
    expect(component.getStatusClass(ActivityStatus.registrationOpen)).toBe('blue');
    expect(component.getStatusClass(ActivityStatus.full)).toBe('purple');
    expect(component.getStatusClass(ActivityStatus.published)).toBe('teal');
    expect(component.getStatusClass(ActivityStatus.active)).toBe('green');
    expect(component.getStatusClass(ActivityStatus.ended)).toBe('grey');
    expect(component.getStatusClass(ActivityStatus.unpublished)).toBe('grey');
  });

  it('isReviewNeeded 對待審核/補件中/地圖建置中回傳 true，其餘回傳 false', () => {
    expect(component.isReviewNeeded(ActivityStatus.pendingReview)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.revisionRequired)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.mapBuilding)).toBeTrue();
    expect(component.isReviewNeeded(ActivityStatus.registrationOpen)).toBeFalse();
    expect(component.isReviewNeeded(ActivityStatus.full)).toBeFalse();
    expect(component.isReviewNeeded(ActivityStatus.ended)).toBeFalse();
  });

  it('依關鍵字篩選活動名稱', () => {
    component.pageSize = 8;
    component.searchKeyword = '咖啡';
    component.onSearch();

    expect(component.totalItems).toBe(2);
    expect(component.activities.every((a: ActivityListItem) => a.name.includes('咖啡'))).toBeTrue();
  });

  it('依主辦方下拉選單篩選', () => {
    component.pageSize = 8;
    component.onOrganizerSelected('森林生活市集');
    component.onSearch();

    expect(component.totalItems).toBe(6);
    expect(component.activities.every((a: ActivityListItem) => a.organizer === '森林生活市集')).toBeTrue();
  });

  it('依狀態下拉選單篩選', () => {
    component.pageSize = 8;
    component.onStatusSelected(ActivityStatus.pendingReview);
    component.onSearch();

    expect(component.totalItems).toBe(3);
    expect(component.activities.every((a: ActivityListItem) => a.status === ActivityStatus.pendingReview)).toBeTrue();
  });

  it('onPageChange 應依目前頁碼切出正確的資料區間', () => {
    component.pageSize = 8;
    component.onSearch();
    expect(component.activities.length).toBe(8);

    component.onPageChange(3);

    expect(component.currentPage).toBe(3);
    expect(component.activities.length).toBe(8);
    expect(component.activities[0].id).toBe(17);
  });

  it('getDetailHandler 回傳的函式應導向活動詳細頁並帶入該筆活動資料', () => {
    component.pageSize = 8;
    component.onSearch();
    const activity = component.activities[0];
    const navigateSpy = spyOn(router, 'navigate');

    component.getDetailHandler(activity)();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dash-board/activity/detail'], { state: { activity } });
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
    expect(rows[0].querySelector('.orange')?.textContent).toContain(ActivityStatus.pendingReview);
    expect(rows[0].querySelector('td:last-child button span')?.textContent?.trim()).toBe('審核');
    expect(rows[1].querySelector('.blue')?.textContent).toContain(ActivityStatus.registrationOpen);
    expect(rows[1].querySelector('td:last-child button span')?.textContent?.trim()).toBe('查看');
  });

  it('activities 為空時，應顯示查無資料的提示列', () => {
    component.activities = [];
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const emptyCell = el.querySelector('tbody tr td.empty-row');
    expect(emptyCell?.textContent).toContain('查無符合條件的活動');
  });
});
