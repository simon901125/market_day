import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorVerifyEmail } from './vendor-verify-email';

describe('VendorVerifyEmail', () => {
  let component: VendorVerifyEmail;
  let fixture: ComponentFixture<VendorVerifyEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorVerifyEmail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorVerifyEmail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
