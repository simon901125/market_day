import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardEventManagement } from './organizer-dashboard-event-management';

describe('OrganizerDashboardEventManagement', () => {
  let component: OrganizerDashboardEventManagement;
  let fixture: ComponentFixture<OrganizerDashboardEventManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardEventManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardEventManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
