import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerActivityHome } from './organizer-activity-home';

describe('OrganizerActivityHome', () => {
  let component: OrganizerActivityHome;
  let fixture: ComponentFixture<OrganizerActivityHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerActivityHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerActivityHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
