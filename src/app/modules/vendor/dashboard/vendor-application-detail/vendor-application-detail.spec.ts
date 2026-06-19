import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { VendorApplicationDetail } from './vendor-application-detail';

describe('VendorApplicationDetail', () => {
  let component: VendorApplicationDetail;
  let fixture: ComponentFixture<VendorApplicationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorApplicationDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorApplicationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render refund applying detail by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(component.currentStatus).toBe('refundApplying');
    expect(textContent).toContain('報名詳細');
    expect(textContent).toContain(component.detail.title);
    expect(textContent).toContain('退款申請中');
    expect(textContent).toContain('退款資訊');
    expect(textContent).toContain('7 - 14 個工作天');
  });
});
