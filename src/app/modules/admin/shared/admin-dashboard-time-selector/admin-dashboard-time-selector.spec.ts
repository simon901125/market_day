import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardTimeSelector } from './admin-dashboard-time-selector';

describe('AdminDashboardTimeSelector', () => {
  let component: AdminDashboardTimeSelector;
  let fixture: ComponentFixture<AdminDashboardTimeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardTimeSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardTimeSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reset() 應清空起訖日期，getTimeRange() 回傳 null，並清空畫面上的輸入框', () => {
    const startInput: HTMLInputElement = fixture.nativeElement.querySelectorAll('input')[0];
    startInput.type = 'date';
    startInput.value = '2026-06-01';
    startInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.getTimeRange().startDate).toBe('2026-06-01');

    component.reset();
    fixture.detectChanges();

    expect(component.getTimeRange()).toEqual({ startDate: null, endDate: null });
    expect(startInput.value).toBe('');
  });
});
