import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerLogin } from './organizer-login';

describe('OrganizerLogin', () => {
  let component: OrganizerLogin;
  let fixture: ComponentFixture<OrganizerLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
