import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardLogs } from './admin-dashboard-logs';

describe('AdminDashboardLogs', () => {
  let component: AdminDashboardLogs;
  let fixture: ComponentFixture<AdminDashboardLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
