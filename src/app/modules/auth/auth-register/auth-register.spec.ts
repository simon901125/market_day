import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AuthRegister } from './auth-register';

describe('AuthRegister', () => {
  let component: AuthRegister;
  let fixture: ComponentFixture<AuthRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRegister],
      providers: [provideRouter([]), provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
