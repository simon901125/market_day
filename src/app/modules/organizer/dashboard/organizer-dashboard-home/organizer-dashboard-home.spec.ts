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
