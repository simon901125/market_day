import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardRegistrationManagement } from './organizer-dashboard-registration-management';

describe('OrganizerDashboardRegistrationManagement', () => {
  let component: OrganizerDashboardRegistrationManagement;
  let fixture: ComponentFixture<OrganizerDashboardRegistrationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardRegistrationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardRegistrationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
