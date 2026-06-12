import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardHome } from './organizer-dashboard-home';

describe('OrganizerDashboardHome', () => {
  let component: OrganizerDashboardHome;
  let fixture: ComponentFixture<OrganizerDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
