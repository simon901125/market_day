import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSignupCompletePage } from './vendor-signup-complete-page';

describe('VendorSignupCompletePage', () => {
  let component: VendorSignupCompletePage;
  let fixture: ComponentFixture<VendorSignupCompletePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupCompletePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSignupCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
