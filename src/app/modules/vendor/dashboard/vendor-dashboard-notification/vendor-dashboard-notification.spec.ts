import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { AlertService } from '../../../../core/services/alert.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { VendorDashboardNotification } from './vendor-dashboard-notification';

describe('VendorDashboardNotification', () => {
  let component: VendorDashboardNotification;
  let fixture: ComponentFixture<VendorDashboardNotification>;
  let vendorDashboardService: jasmine.SpyObj<VendorDashboardService>;
  let notificationApi: jasmine.SpyObj<NotificationApiService>;

  beforeEach(async () => {
    vendorDashboardService = jasmine.createSpyObj('VendorDashboardService', ['getVendorNotifications']);
    notificationApi = jasmine.createSpyObj('NotificationApiService', ['markAsRead']);
    vendorDashboardService.getVendorNotifications.and.returnValue(of({
      statusCode: 200,
      message: 'OK',
      messageDetails: null,
      data: {
        unreadCount: 1,
        notifications: {
          items: [{
            id: 31,
            category: 'PAYMENT',
            type: 'PAYMENT_PAID',
            targetType: 'EVENT_APPLICATION',
            targetId: 9,
            title: '付款成功',
            content: '已收到活動款項',
            isRead: false,
            readAt: null,
            createdAt: '2026-07-20T10:30:00',
          }],
          page: 1,
          pageSize: 8,
          totalItems: 1,
          totalPages: 1,
          hasPrevious: false,
          hasNext: false,
        },
      },
    }));
    notificationApi.markAsRead.and.returnValue(of({
      statusCode: 200,
      message: 'OK',
      messageDetails: null,
      data: { id: 31, isRead: true },
    }));

    await TestBed.configureTestingModule({
      imports: [VendorDashboardNotification],
      providers: [
        { provide: VendorDashboardService, useValue: vendorDashboardService },
        { provide: NotificationApiService, useValue: notificationApi },
        { provide: AlertService, useValue: jasmine.createSpyObj('AlertService', ['error']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads notifications from the vendor notices API', () => {
    expect(vendorDashboardService.getVendorNotifications).toHaveBeenCalledWith({
      filter: '全部',
      page: 1,
      pageSize: 8,
    });
    expect(component.totalItems).toBe(1);
    expect(component.notifications[0]).toEqual(jasmine.objectContaining({
      id: 31,
      status: '付款成功',
      title: '已收到活動款項',
      unread: true,
    }));
  });

  it('reloads from page one when a category is selected', () => {
    component.onTabChange('付款相關');

    expect(vendorDashboardService.getVendorNotifications).toHaveBeenCalledWith({
      filter: '付款相關',
      page: 1,
      pageSize: 8,
    });
  });

  it('persists read state through the shared notification API', () => {
    const item = component.notifications[0];
    item.unread = false;
    component.onMarkRead(item);

    expect(notificationApi.markAsRead).toHaveBeenCalledWith(31, { skipLoading: true });
    expect(component.unreadCount).toBe(0);
  });
});
