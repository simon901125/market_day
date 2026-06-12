import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerHeader } from './organizer-header';

describe('OrganizerHeader', () => {
  let component: OrganizerHeader;
  let fixture: ComponentFixture<OrganizerHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
