import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { OrganizerDashboardEventDetail } from './organizer-dashboard-event-detail';

describe('OrganizerDashboardEventDetail', () => {
  let component: OrganizerDashboardEventDetail;
  let fixture: ComponentFixture<OrganizerDashboardEventDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardEventDetail],
      providers: [provideRouter([]), provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardEventDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('補件中應顯示補件原因', () => {
    component.isRevisionRequired = true;
    component.reviewNote = '請補上完整的交通資訊';

    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector('.revision-notice') as HTMLElement;
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('活動需要補件');
    expect(notice.textContent).toContain('請補上完整的交通資訊');
  });
});
