import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { OrganizerDashboardHome } from './organizer-dashboard-home';

describe('OrganizerDashboardHome', () => {
  let component: OrganizerDashboardHome;
  let fixture: ComponentFixture<OrganizerDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardHome],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide three activities for the registration overview', () => {
    expect(component.activityRegistrationOverview.length).toBe(3);
  });
});
