import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSidebar } from './dashboard-sidebar';

describe('DashboardSidebar', () => {
  let component: DashboardSidebar;
  let fixture: ComponentFixture<DashboardSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the user menu while the sidebar is collapsed', () => {
    component.isCollapsed = true;

    component.toggleUserMenu();

    expect(component.isUserMenuOpen).toBeTrue();
  });

  it('should lock vendor application records until the stall profile is complete', () => {
    const item = {
      label: '我的報名紀錄',
      icon: 'bi-clipboard-check',
      path: '/vendor/dash-board/application-record',
      requiresVendorProfile: true,
    };
    component.vendorProfileRequired = true;

    expect(component.isMenuItemLocked(item)).toBeTrue();
    expect(component.lockedMenuItemTitle(item)).toContain('攤位資料');
  });
});
