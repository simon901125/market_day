import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VendorPaymentPage } from './vendor-payment-page';

describe('VendorPaymentPage', () => {
  let component: VendorPaymentPage;
  let fixture: ComponentFixture<VendorPaymentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPaymentPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render payment data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain(component.paymentSummary.title);
    expect(textContent).toContain(component.paymentSummary.signupCode);
    expect(textContent).toContain(component.formatCurrency(component.totalAmount));
  });
});
