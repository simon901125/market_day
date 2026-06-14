import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { VendorPasswordSettings } from './vendor-password-settings';

describe('VendorPasswordSettings', () => {
  let component: VendorPasswordSettings;
  let fixture: ComponentFixture<VendorPasswordSettings>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPasswordSettings],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPasswordSettings);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render password rule by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain(component.passwordRule);
  });

  it('should toggle password visibility for the selected field', () => {
    component.toggleVisible('newPassword');

    expect(component.visible.newPassword).toBeTrue();
    expect(component.visible.currentPassword).toBeFalse();
    expect(component.visible.confirmPassword).toBeFalse();
  });

  it('should navigate back to account settings when saved', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.save();

    expect(navigateSpy).toHaveBeenCalledWith(['/vendor/dash-board/account-settings']);
  });
});
