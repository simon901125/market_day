import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardEventDetail } from './organizer-dashboard-event-detail';

describe('OrganizerDashboardEventDetail', () => {
  let component: OrganizerDashboardEventDetail;
  let fixture: ComponentFixture<OrganizerDashboardEventDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardEventDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardEventDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
