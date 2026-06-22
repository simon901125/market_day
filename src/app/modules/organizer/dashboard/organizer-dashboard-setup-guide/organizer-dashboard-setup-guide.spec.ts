import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerDashboardSetupGuide } from './organizer-dashboard-setup-guide';

describe('OrganizerDashboardSetupGuide', () => {
  let component: OrganizerDashboardSetupGuide;
  let fixture: ComponentFixture<OrganizerDashboardSetupGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardSetupGuide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardSetupGuide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
