import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerActivitySidebar } from './organizer-activity-sidebar';

describe('OrganizerActivitySidebar', () => {
  let component: OrganizerActivitySidebar;
  let fixture: ComponentFixture<OrganizerActivitySidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerActivitySidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerActivitySidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
