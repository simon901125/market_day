import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardMarketDetail } from './admin-dashboard-market-detail';

describe('AdminDashboardMarketDetail', () => {
  let component: AdminDashboardMarketDetail;
  let fixture: ComponentFixture<AdminDashboardMarketDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardMarketDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardMarketDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
