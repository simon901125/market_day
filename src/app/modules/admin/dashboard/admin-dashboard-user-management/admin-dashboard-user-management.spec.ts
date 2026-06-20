import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUserManagement } from './admin-dashboard-user-management';

describe('AdminDashboardUserManagement', () => {
  let component: AdminDashboardUserManagement;
  let fixture: ComponentFixture<AdminDashboardUserManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardUserManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
