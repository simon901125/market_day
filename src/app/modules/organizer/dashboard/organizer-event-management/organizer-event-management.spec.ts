import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerEventManagement } from './organizer-event-management';

describe('OrganizerEventManagement', () => {
  let component: OrganizerEventManagement;
  let fixture: ComponentFixture<OrganizerEventManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerEventManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerEventManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
