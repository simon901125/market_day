import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorResetPassword } from './vendor-reset-password';

describe('VendorResetPassword', () => {
  let component: VendorResetPassword;
  let fixture: ComponentFixture<VendorResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorResetPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
