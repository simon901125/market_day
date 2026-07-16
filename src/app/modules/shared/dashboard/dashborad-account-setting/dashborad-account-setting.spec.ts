import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';

import { DashboradAccountSetting } from './dashborad-account-setting';

describe('DashboradAccountSetting', () => {
  let component: DashboradAccountSetting;
  let fixture: ComponentFixture<DashboradAccountSetting>;
  let authService: jasmine.SpyObj<AuthService>;
  let alertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'changePassword',
    ]);
    alertService = jasmine.createSpyObj<AlertService>('AlertService', [
      'success',
    ]);

    await TestBed.configureTestingModule({
      imports: [DashboradAccountSetting],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        { provide: AlertService, useValue: alertService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboradAccountSetting);
    component = fixture.componentInstance;
    component.account = {
      name: '測試攤主',
      email: 'vendor@example.com',
      googleBound: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render account data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain('測試攤主');
    expect(textContent).toContain('vendor@example.com');
    expect(textContent).toContain('未綁定');
  });

  it('should emit closed event after the close animation', fakeAsync(() => {
    const closeSpy = spyOn(component.closed, 'emit');

    component.close();
    tick(150);

    expect(closeSpy).toHaveBeenCalled();
  }));

  it('should open shared password setting', () => {
    component.openPasswordSetting();
    fixture.detectChanges();

    expect(component.passwordSettingOpen).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('為了保護帳號安全');
  });

  it('should send current and new passwords to the change password API', async () => {
    authService.changePassword.and.returnValue(
      of({ statusCode: 200, message: 'success', messageDetails: null, data: null })
    );
    alertService.success.and.resolveTo({} as never);
    component.passwordSettingOpen = true;

    await component.handlePasswordSaved({
      currentPassword: 'CurrentPassword1',
      newPassword: 'NewPassword1',
      confirmPassword: 'NewPassword1',
    });

    expect(authService.changePassword).toHaveBeenCalledOnceWith({
      currentPassword: 'CurrentPassword1',
      password: 'NewPassword1',
    });
    expect(component.passwordSettingOpen).toBeFalse();
  });
});
