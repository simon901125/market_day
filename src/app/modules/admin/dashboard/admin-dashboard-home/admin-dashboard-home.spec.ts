import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AdminDashboardHome } from './admin-dashboard-home';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { NotificationApiService } from '../../../../core/services/notification-api.service';
import { AdminDashboardOverview } from '../../../../models/interface/admin/AdminDashboardOverview';

const fakeOverview: AdminDashboardOverview = {
  pendingReview: 0,
  mapBuilding: 0,
  pendingUnpublish: 0,
  systemWarning: 0,
  totalOrganizer: 0,
  totalVender: 0,
  totalActivity: 0,
  active: 0,
  notices: [],
};

describe('AdminDashboardHome', () => {
  let component: AdminDashboardHome;
  let fixture: ComponentFixture<AdminDashboardHome>;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['getDashboardOverview']);
    adminApiServiceSpy.getDashboardOverview.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeOverview }),
    );

    const notificationApiServiceSpy = jasmine.createSpyObj('NotificationApiService', ['markAsRead']);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardHome],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: adminApiServiceSpy },
        { provide: NotificationApiService, useValue: notificationApiServiceSpy },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
