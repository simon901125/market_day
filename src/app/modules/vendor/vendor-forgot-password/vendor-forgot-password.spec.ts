import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorForgotPassword } from './vendor-forgot-password';

describe('VendorForgotPassword', () => {
  let component: VendorForgotPassword;
  let fixture: ComponentFixture<VendorForgotPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorForgotPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
