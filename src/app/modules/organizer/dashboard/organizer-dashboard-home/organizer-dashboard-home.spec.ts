import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardHome } from './organizer-dashboard-home';

describe('OrganizerDashboardHome', () => {
  let component: OrganizerDashboardHome;
  let fixture: ComponentFixture<OrganizerDashboardHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardHome],
      providers: [
        provideRouter([]),
        {
          provide: OrganizerApiService,
          useValue: {
            getOrganizerDashboardInit: () => of({
              statusCode: 200,
              message: 'OK',
              messageDetails: null,
              data: { needsProfile: false },
            }),
            searchOrganizerEvents: () => of({
              statusCode: 200,
              message: 'OK',
              messageDetails: null,
              data: {
                totalCount: 3,
                events: {
                  items: [1, 2, 3].map((eventId) => ({
                    eventId,
                    eventTitle: `Market ${eventId}`,
                    capacity: 100,
                    registeredCount: 80,
                    paidCount: 70,
                    selectedCount: 60,
                  })),
                },
              },
            }),
            searchOrganizerApplications: () => of({
              statusCode: 200,
              message: 'OK',
              messageDetails: null,
              data: {
                taskSummary: {
                  pendingReviewCount: 12,
                  pendingRefundConfirmationCount: 3,
                  pendingStallSelectionCount: 50,
                },
                totalCount: 0,
                applications: { items: [] },
              },
            }),
          },
        },
      ],
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
