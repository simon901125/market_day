import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardEventManagement } from './organizer-dashboard-event-management';

describe('OrganizerDashboardEventManagement', () => {
  let component: OrganizerDashboardEventManagement;
  let fixture: ComponentFixture<OrganizerDashboardEventManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardEventManagement],
      providers: [
        provideRouter([]),
        {
          provide: OrganizerApiService,
          useValue: {
            searchOrganizerEvents: () => of({
              statusCode: 200,
              message: 'OK',
              messageDetails: null,
              data: {
                taskSummary: {
                  pendingReviewCount: 0,
                  pendingRefundConfirmationCount: 0,
                  pendingStallSelectionCount: 0,
                },
                totalCount: 0,
                events: { items: [] },
              },
            }),
          },
        },
      ],
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
