import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerHome } from './organizer-home';

describe('OrganizerHome', () => {
  let component: OrganizerHome;
  let fixture: ComponentFixture<OrganizerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
