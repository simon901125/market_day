import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { VendorDashboardNotification } from './vendor-dashboard-notification';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';

describe('VendorDashboardNotification', () => {
  let component: VendorDashboardNotification;
  let fixture: ComponentFixture<VendorDashboardNotification>;
  let vendorDashboardService: jasmine.SpyObj<VendorDashboardService>;

  beforeEach(async () => {
    vendorDashboardService = jasmine.createSpyObj('VendorDashboardService', [
      'getVendorNotifications',
    ]);
    vendorDashboardService.getVendorNotifications.and.returnValue(of({
      statusCode: 200,
      message: 'ok',
      messageDetails: null,
      data: {
        unreadCount: 0,
        notifications: {
          items: [],
          page: 1,
          pageSize: 8,
          totalItems: 0,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
        },
      },
    }));
    const notificationApiService = jasmine.createSpyObj('NotificationApiService', ['markAsRead']);

    await TestBed.configureTestingModule({
      imports: [VendorDashboardNotification],
      providers: [
        { provide: VendorDashboardService, useValue: vendorDashboardService },
        { provide: NotificationApiService, useValue: notificationApiService },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the empty notification state from the API', () => {
    expect(vendorDashboardService.getVendorNotifications).toHaveBeenCalledWith('全部', 1, 8);
    expect(component.notifications).toEqual([]);
    expect(component.totalItems).toBe(0);
  });
});
