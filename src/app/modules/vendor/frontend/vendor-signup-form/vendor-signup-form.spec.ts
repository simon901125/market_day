import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignupForm } from './vendor-signup-form';

describe('VendorSignupForm', () => {
  let component: VendorSignupForm;
  let fixture: ComponentFixture<VendorSignupForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignupForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
