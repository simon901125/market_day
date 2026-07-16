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
});
