import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashboardShell } from './vendor-dashboard-shell';

describe('VendorDashboardShell', () => {
  let component: VendorDashboardShell;
  let fixture: ComponentFixture<VendorDashboardShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDashboardShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
