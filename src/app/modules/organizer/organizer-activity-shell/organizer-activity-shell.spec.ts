import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerActivityShell } from './organizer-activity-shell';

describe('OrganizerActivityShell', () => {
  let component: OrganizerActivityShell;
  let fixture: ComponentFixture<OrganizerActivityShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerActivityShell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerActivityShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
