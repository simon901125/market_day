import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { DashboradAccountSetting } from '../../../shared/dashboard/dashborad-account-setting/dashborad-account-setting';
import { VendorAccountSettings } from './vendor-account-settings';

describe('VendorAccountSettings', () => {
  let component: VendorAccountSettings;
  let fixture: ComponentFixture<VendorAccountSettings>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorAccountSettings],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorAccountSettings);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render account data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain(component.account.name);
    expect(textContent).toContain(component.account.email);
    expect(textContent).toContain('未綁定');
  });

  it('should navigate back to dashboard home when closed', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.close();

    expect(navigateSpy).toHaveBeenCalledWith(['/vendor/dash-board/home']);
  });

  it('should open shared password setting from account settings', () => {
    const sharedAccountSetting = fixture.debugElement.query(
      By.directive(DashboradAccountSetting)
    ).componentInstance as DashboradAccountSetting;
    const passwordButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('button.outline-action');

    passwordButton.click();
    fixture.detectChanges();

    expect(sharedAccountSetting.passwordSettingOpen).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('為了保護帳號安全');
  });
});
