import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthLogin } from './auth-login';

describe('AuthLogin', () => {
  let component: AuthLogin;
  let fixture: ComponentFixture<AuthLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthLogin],
      providers: [provideRouter([]), provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
