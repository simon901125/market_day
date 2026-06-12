import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashboardHome } from './vendor-dashboard-home';

describe('VendorDashboardHome', () => {
  let component: VendorDashboardHome;
  let fixture: ComponentFixture<VendorDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDashboardHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
