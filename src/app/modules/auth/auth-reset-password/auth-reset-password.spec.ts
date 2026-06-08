import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthResetPassword } from './auth-reset-password';

describe('AuthResetPassword', () => {
  let component: AuthResetPassword;
  let fixture: ComponentFixture<AuthResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthResetPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
