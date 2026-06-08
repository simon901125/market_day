import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthVerifyEmail } from './auth-verify-email';

describe('AuthVerifyEmail', () => {
  let component: AuthVerifyEmail;
  let fixture: ComponentFixture<AuthVerifyEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthVerifyEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthVerifyEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
