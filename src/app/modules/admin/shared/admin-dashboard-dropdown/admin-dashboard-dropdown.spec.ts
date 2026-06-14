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
});
