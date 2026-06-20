import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUserDetailVender } from './admin-dashboard-user-detail-vender';

describe('AdminDashboardUserDetailVender', () => {
  let component: AdminDashboardUserDetailVender;
  let fixture: ComponentFixture<AdminDashboardUserDetailVender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardUserDetailVender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserDetailVender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
