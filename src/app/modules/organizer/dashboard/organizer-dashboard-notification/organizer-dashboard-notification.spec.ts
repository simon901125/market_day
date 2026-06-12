import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardNotification } from './organizer-dashboard-notification';

describe('OrganizerDashboardNotification', () => {
  let component: OrganizerDashboardNotification;
  let fixture: ComponentFixture<OrganizerDashboardNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
