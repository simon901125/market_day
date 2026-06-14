import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSerchInput } from './admin-dashboard-serch-input';

describe('AdminDashboardSerchInput', () => {
  let component: AdminDashboardSerchInput;
  let fixture: ComponentFixture<AdminDashboardSerchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSerchInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSerchInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
