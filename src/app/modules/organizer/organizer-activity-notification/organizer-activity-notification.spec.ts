import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerActivityNotification } from './organizer-activity-notification';

describe('OrganizerActivityNotification', () => {
  let component: OrganizerActivityNotification;
  let fixture: ComponentFixture<OrganizerActivityNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerActivityNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerActivityNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
