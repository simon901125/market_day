import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPasswordSetting } from './dashboard-password-setting';

describe('DashboardPasswordSetting', () => {
  let component: DashboardPasswordSetting;
  let fixture: ComponentFixture<DashboardPasswordSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPasswordSetting],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPasswordSetting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    component.toggleVisible('currentPassword');

    expect(component.visible.currentPassword).toBeTrue();
  });

  it('should reject an invalid new password', () => {
    component.passwordForm = {
      currentPassword: 'OldPassword1',
      newPassword: '12345678',
      confirmPassword: '12345678',
    };

    component.save();

    expect(component.errorMessage).toBe(component.passwordRule);
  });

  it('should emit password payload and close when form is valid', () => {
    const savedSpy = spyOn(component.saved, 'emit');
    const openChangeSpy = spyOn(component.openChange, 'emit');
    component.passwordForm = {
      currentPassword: 'OldPassword1',
      newPassword: 'NewPassword2',
      confirmPassword: 'NewPassword2',
    };

    component.save();

    expect(savedSpy).toHaveBeenCalledWith({
      currentPassword: 'OldPassword1',
      newPassword: 'NewPassword2',
      confirmPassword: 'NewPassword2',
    });
    expect(openChangeSpy).toHaveBeenCalledWith(false);
  });
});
