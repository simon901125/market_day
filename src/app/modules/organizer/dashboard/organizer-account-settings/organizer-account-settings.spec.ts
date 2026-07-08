import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../../../../core/auth/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';
import { DashboradAccountSetting } from '../../../shared/dashboard/dashborad-account-setting/dashborad-account-setting';
import { OrganizerAccountSettings } from './organizer-account-settings';

describe('OrganizerAccountSettings', () => {
  let component: OrganizerAccountSettings;
  let fixture: ComponentFixture<OrganizerAccountSettings>;
  let router: Router;

  const user = {
    email: 'organizer@example.com',
    name: '測試主辦方',
    role: 'ORGANIZER' as const,
    status: 'ACTIVE',
    isLogin: true,
    provider: 'LOCAL',
    googleSub: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerAccountSettings],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getUser: () => user,
            me: () => of({ statusCode: 200, data: { user } }),
            saveUser: jasmine.createSpy('saveUser'),
          },
        },
        {
          provide: GoogleAuthService,
          useValue: {
            getCredential: jasmine.createSpy('getCredential'),
          },
        },
        {
          provide: AlertService,
          useValue: {
            success: jasmine.createSpy('success').and.resolveTo(undefined),
            error: jasmine.createSpy('error').and.resolveTo(undefined),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerAccountSettings);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render account data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain('測試主辦方');
    expect(textContent).toContain('organizer@example.com');
    expect(textContent).toContain('未綁定');
  });

  it('should navigate back to dashboard home when closed', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.close();

    expect(navigateSpy).toHaveBeenCalledWith(['/organizer/dash-board/home']);
  });

  it('should open shared password setting from account settings', () => {
    const sharedAccountSetting = fixture.debugElement.query(
      By.directive(DashboradAccountSetting)
    ).componentInstance as DashboradAccountSetting;

    sharedAccountSetting.openPasswordSetting();
    fixture.detectChanges();

    expect(sharedAccountSetting.passwordSettingOpen).toBeTrue();
  });
});
