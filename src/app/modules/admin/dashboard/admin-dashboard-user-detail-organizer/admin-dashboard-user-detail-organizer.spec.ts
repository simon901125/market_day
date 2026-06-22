import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardUserDetailOrganizer } from './admin-dashboard-user-detail-organizer';

describe('AdminDashboardUserDetailOrganizer', () => {
  let component: AdminDashboardUserDetailOrganizer;
  let fixture: ComponentFixture<AdminDashboardUserDetailOrganizer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardUserDetailOrganizer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardUserDetailOrganizer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
