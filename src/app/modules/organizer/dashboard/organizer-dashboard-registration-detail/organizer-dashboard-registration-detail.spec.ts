import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardRegistrationDetail } from './organizer-dashboard-registration-detail';

describe('OrganizerDashboardRegistrationDetail', () => {
  let component: OrganizerDashboardRegistrationDetail;
  let fixture: ComponentFixture<OrganizerDashboardRegistrationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardRegistrationDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardRegistrationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
