import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminDashboardNotification } from './admin-dashboard-notification';
import { AdminApiService } from '../../../../core/services/admin-api.service';
import { AdminNoticePage } from '../../../../models/interface/admin/AdminNoticeSearch';

const fakeNoticePage: AdminNoticePage = {
  items: [],
  page: 1,
  pageSize: 8,
  totalItems: 0,
  totalPages: 0,
  hasPrevious: false,
  hasNext: false,
};

describe('AdminDashboardNotification', () => {
  let component: AdminDashboardNotification;
  let fixture: ComponentFixture<AdminDashboardNotification>;
  let adminApiServiceSpy: jasmine.SpyObj<AdminApiService>;

  beforeEach(async () => {
    adminApiServiceSpy = jasmine.createSpyObj('AdminApiService', ['searchNotices']);
    adminApiServiceSpy.searchNotices.and.returnValue(
      of({ statusCode: 200, message: 'ok', messageDetails: null, data: fakeNoticePage }),
    );

    await TestBed.configureTestingModule({
      imports: [AdminDashboardNotification],
      providers: [{ provide: AdminApiService, useValue: adminApiServiceSpy }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
