import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignupConfirmPage } from './vendor-signup-confirm-page';

describe('VendorSignupConfirmPage', () => {
  let component: VendorSignupConfirmPage;
  let fixture: ComponentFixture<VendorSignupConfirmPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupConfirmPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignupConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
