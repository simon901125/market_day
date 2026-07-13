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
    expect(textContent).toContain('退款申請中');
    expect(textContent).toContain(component.detail.title);
    expect(textContent).toContain('退款審核時間');
    expect(textContent).toContain('7 - 14 個工作天');
  });

  it('should render refund processing detail by binding', () => {
    component.setStatus('refundProcessing');
    fixture.detectChanges();

    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain('退款處理中');
    expect(textContent).toContain('退款審核時間');
    expect(textContent).toContain('2026/06/10 10:55');
  });

  it('should render refund success detail and booth action by binding', () => {
    component.setStatus('refundSuccess');
    fixture.detectChanges();

    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain('退款申請');
    expect(textContent).toContain('待選位');
    expect(textContent).toContain('尚未選擇攤位');
  });
});
