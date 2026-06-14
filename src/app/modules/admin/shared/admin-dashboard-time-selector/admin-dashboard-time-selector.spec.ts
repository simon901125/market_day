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
});
