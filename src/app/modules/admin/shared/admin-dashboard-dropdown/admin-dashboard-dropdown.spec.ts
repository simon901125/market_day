import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardDropdown } from './admin-dashboard-dropdown';

describe('AdminDashboardDropdown', () => {
  let component: AdminDashboardDropdown;
  let fixture: ComponentFixture<AdminDashboardDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reset() 應清空已選擇的值，displayLabel 恢復為 placeholder', () => {
    component.options = ['A', 'B'];
    component.placeholder = '全部';
    component.selectOption(0);
    expect(component.displayLabel).toBe('A');

    component.reset();

    expect(component.selectedValue).toBe('');
    expect(component.displayLabel).toBe('全部');
  });
});
