import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardButton } from './admin-dashboard-button';

describe('AdminDashboardButton', () => {
  let component: AdminDashboardButton;
  let fixture: ComponentFixture<AdminDashboardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
