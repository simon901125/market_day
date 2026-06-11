import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashboardNotification } from './vendor-dashboard-notification';

describe('VendorDashboardNotification', () => {
  let component: VendorDashboardNotification;
  let fixture: ComponentFixture<VendorDashboardNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDashboardNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
