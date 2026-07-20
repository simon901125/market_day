import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardNotification } from './organizer-dashboard-notification';

describe('OrganizerDashboardNotification', () => {
  let component: OrganizerDashboardNotification;
  let fixture: ComponentFixture<OrganizerDashboardNotification>;
  let organizerApi: jasmine.SpyObj<OrganizerApiService>;
  let notificationApi: jasmine.SpyObj<NotificationApiService>;

  const notificationResponse = {
    statusCode: 200,
    message: '主辦方通知取得成功',
    messageDetails: null,
    data: {
      unreadCount: 1,
      notifications: {
        items: [{
          id: 9,
          category: 'EVENT_MANAGEMENT',
          type: 'EVENT_MAP_COMPLETED',
          targetType: 'MARKET_EVENT',
          targetId: 2,
          title: '活動地圖建置完成',
          content: '「梅西測試」的攤位地圖已建置完成。',
          isRead: false,
          readAt: null,
          createdAt: '2026-07-20T14:30:00',
        }],
        page: 1,
        pageSize: 8,
        totalItems: 1,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      },
    },
  };

  beforeEach(async () => {
    organizerApi = jasmine.createSpyObj('OrganizerApiService', ['getOrganizerNotifications']);
    notificationApi = jasmine.createSpyObj('NotificationApiService', ['markAsRead']);
    organizerApi.getOrganizerNotifications.and.returnValue(of(notificationResponse));
    notificationApi.markAsRead.and.returnValue(of({
      statusCode: 200,
      message: '通知已標記為已讀',
      messageDetails: null,
      data: { id: 9, isRead: true },
    }));

    await TestBed.configureTestingModule({
      imports: [OrganizerDashboardNotification],
      providers: [
        { provide: OrganizerApiService, useValue: organizerApi },
        { provide: NotificationApiService, useValue: notificationApi },
        { provide: AlertService, useValue: jasmine.createSpyObj('AlertService', ['error']) },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('應載入後端通知並轉換類型、內容與日期', () => {
    expect(organizerApi.getOrganizerNotifications).toHaveBeenCalledWith({
      filter: '全部',
      page: 1,
      pageSize: 8,
    });
    expect(component.notifications[0]).toEqual(jasmine.objectContaining({
      id: 9,
      status: '地圖完成',
      title: '「梅西測試」的攤位地圖已建置完成。',
      date: '2026/07/20 14:30',
      unread: true,
      type: 'eventMapCompleted',
    }));
  });

  it('切換分類時應從第一頁帶後端支援的 filter 重新查詢', () => {
    component.onTabChange('付款相關');

    expect(organizerApi.getOrganizerNotifications).toHaveBeenCalledWith({
      filter: '付款相關',
      page: 1,
      pageSize: 8,
    });
  });

  it('點擊未讀通知應呼叫共用標記已讀 API', () => {
    component.onMarkRead(component.notifications[0]);

    expect(notificationApi.markAsRead).toHaveBeenCalledWith(9, { skipLoading: true });
    expect(component.unreadCount).toBe(0);
  });
});
