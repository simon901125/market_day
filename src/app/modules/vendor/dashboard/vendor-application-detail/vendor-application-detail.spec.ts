import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { VendorApplicationDetail } from './vendor-application-detail';

describe('VendorApplicationDetail', () => {
  let component: VendorApplicationDetail;
  let fixture: ComponentFixture<VendorApplicationDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorApplicationDetail],
      providers: [
        provideRouter([]),
        {
          provide: VendorService,
          useValue: {
            getVendorApplicationDetail: () =>
              of({
                statusCode: 200,
                message: 'ok',
                messageDetails: null,
                data: {
                  event: {
                    eventId: 1,
                    eventTitle: '測試活動',
                    workflowStatus: 'PUBLISHED',
                    unpublishRequested: false,
                    unpublished: false,
                    eventStatus: 'OPEN',
                  },
                },
              }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorApplicationDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an unpublish request notice without suspending the existing application flow', () => {
    component.marketWorkflowStatus = 'UNPUBLISH_REQUESTED';
    (component as unknown as { marketWorkflowLoaded: boolean }).marketWorkflowLoaded = true;
    fixture.detectChanges();

    const textContent: string = fixture.nativeElement.textContent;
    expect(textContent).toContain('活動目前處於下架申請中');
    expect(textContent).toContain('原有報名流程維持正常');
  });

  it('should tell a paid vendor that an unpublished event will enter the refund process', () => {
    component.marketWorkflowStatus = 'UNPUBLISHED';
    (component as unknown as { marketWorkflowLoaded: boolean }).marketWorkflowLoaded = true;
    fixture.detectChanges();

    const textContent: string = fixture.nativeElement.textContent;
    expect(textContent).toContain('活動已下架');
    expect(textContent).toContain('平台將進行後續退款流程');
  });

  it('should render refund applying detail by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(component.currentStatus).toBe('refundApplying');
    expect(textContent).toContain(component.detail.statusText);
    expect(textContent).toContain(component.detail.title);
    expect(textContent).toContain('主辦單位已收到您的退款申請');
    expect(textContent).toContain('個人行程安排故申請本次退款');
  });

  it('should render refund processing detail by binding', () => {
    component.setStatus('refundProcessing');
    fixture.detectChanges();

    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain(component.detail.statusText);
    expect(textContent).toContain('款項將依原付款方式退回');
    expect(textContent).toContain('退款時間');
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
