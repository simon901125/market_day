import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardMarketManagemant } from './admin-dashboard-market-managemant';

describe('AdminDashboardMarketManagemant', () => {
  let component: AdminDashboardMarketManagemant;
  let fixture: ComponentFixture<AdminDashboardMarketManagemant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketManagemant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMarketManagemant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
