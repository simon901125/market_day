import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { OrganizerDashboardEventDetail } from './organizer-dashboard-event-detail';
import { AlertService } from '../../../../core/services/alert.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';

describe('OrganizerDashboardEventDetail', () => {
  let component: OrganizerDashboardEventDetail;
  let fixture: ComponentFixture<OrganizerDashboardEventDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardEventDetail],
      providers: [provideRouter([]), provideHttpClient()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardEventDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the actual and expected stall counts when publishing fails', () => {
    const message = (component as unknown as {
      publishFailureMessage: (result: unknown, fallback: string) => string;
    }).publishFailureMessage(
      {
        missingFields: ['booth.stalls'],
        expectedStallCount: 20,
        actualStallCount: 0,
      },
      '活動尚未符合發布條件',
    );

    expect(message).toBe('攤位地圖尚未建置完成，目前已建立 0 / 20 個攤位。');
  });

  it('補件中應顯示補件原因', () => {
    component.isRevisionRequired = true;
    component.reviewNote = '請補上完整的交通資訊';

    fixture.detectChanges();

    const notice = fixture.nativeElement.querySelector('.revision-notice') as HTMLElement;
    expect(notice).toBeTruthy();
    expect(notice.textContent).toContain('活動需要補件');
    expect(notice.textContent).toContain('請補上完整的交通資訊');
  });

  it('取消刪除確認時不應呼叫刪除 API', async () => {
    const alert = TestBed.inject(AlertService);
    const organizerApiService = TestBed.inject(OrganizerApiService);
    spyOn(alert, 'confirm').and.resolveTo(false);
    const deleteSpy = spyOn(organizerApiService, 'deleteOrganizerEvent');

    await component.handleStatusAction({ key: 'delete', label: '刪除', variant: 'danger' });

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('刪除成功後應呼叫 API 並返回活動列表', async () => {
    component.activity = { ...component.activity, id: 21, name: '測試活動' };
    const alert = TestBed.inject(AlertService);
    const organizerApiService = TestBed.inject(OrganizerApiService);
    const router = TestBed.inject(Router);
    spyOn(alert, 'confirm').and.resolveTo(true);
    spyOn(alert, 'success').and.resolveTo(undefined);
    const deleteSpy = spyOn(organizerApiService, 'deleteOrganizerEvent').and.returnValue(of({
      statusCode: 200,
      message: '活動已刪除',
      messageDetails: null,
      data: { eventId: 21, eventTitle: '測試活動' },
    }));
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    await component.handleStatusAction({ key: 'delete', label: '刪除', variant: 'danger' });

    expect(deleteSpy).toHaveBeenCalledOnceWith(21);
    expect(navigateSpy).toHaveBeenCalled();
    expect(component.isStatusActionLoading).toBeFalse();
  });
});
