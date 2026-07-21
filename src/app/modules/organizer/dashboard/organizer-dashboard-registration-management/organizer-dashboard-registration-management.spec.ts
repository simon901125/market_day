import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NEVER } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardRegistrationManagement } from './organizer-dashboard-registration-management';

describe('OrganizerDashboardRegistrationManagement', () => {
  let component: OrganizerDashboardRegistrationManagement;
  let fixture: ComponentFixture<OrganizerDashboardRegistrationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardRegistrationManagement],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: OrganizerApiService,
          useValue: { searchOrganizerApplications: () => NEVER },
        },
      ],
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
