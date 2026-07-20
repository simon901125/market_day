import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { NEVER } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardRegistrationDetail } from './organizer-dashboard-registration-detail';

describe('OrganizerDashboardRegistrationDetail', () => {
  let component: OrganizerDashboardRegistrationDetail;
  let fixture: ComponentFixture<OrganizerDashboardRegistrationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardRegistrationDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
              queryParamMap: convertToParamMap({}),
            },
          },
        },
        {
          provide: OrganizerApiService,
          useValue: { getOrganizerApplicationDetail: () => NEVER },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardRegistrationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
