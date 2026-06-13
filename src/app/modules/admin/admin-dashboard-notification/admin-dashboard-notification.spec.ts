import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardNotification } from './admin-dashboard-notification';

describe('AdminDashboardNotification', () => {
  let component: AdminDashboardNotification;
  let fixture: ComponentFixture<AdminDashboardNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
