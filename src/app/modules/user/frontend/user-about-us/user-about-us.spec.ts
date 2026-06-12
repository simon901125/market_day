import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAboutUs } from './user-about-us';

describe('UserAboutUs', () => {
  let component: UserAboutUs;
  let fixture: ComponentFixture<UserAboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAboutUs],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
