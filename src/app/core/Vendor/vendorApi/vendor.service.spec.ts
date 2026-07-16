import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../../environments/environment';
import {
  VendorApplicationSubmitRequest,
} from '../../../models/interface/vendor/VendorApplicationSubmit';
import { VendorStallSaveRequest } from '../../../models/interface/vendor/VendorStallInfo';
import { VendorService } from './vendor.service';

describe('VendorService', () => {
  let service: VendorService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VendorService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit a vendor application', () => {
    const payload: VendorApplicationSubmitRequest = {
      eventId: 1,
      applyDates: ['2026-08-01', '2026-08-02'],
      vehicleNo: 'ABC-1234',
      applicantNote: '靠近入口佳',
      equipmentRentals: [
        {
          eventEquipmentId: 3,
          quantity: 1,
          rentalUnits: 2,
          appliances: [{ applianceName: '咖啡機', wattage: 800 }],
        },
      ],
    };

    service.submitVendorApplication(payload).subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}api/vendor/applications`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({
      statusCode: 200,
      message: '活動報名送出成功',
      messageDetails: null,
      data: {},
    });
  });

  it('should get vendor stall info', () => {
    service.getVendorStallInfo().subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}api/vendor/stall/load`);
    expect(request.request.method).toBe('GET');
    request.flush({ statusCode: 200, message: 'ok', messageDetails: null, data: {} });
  });

  it('should save vendor stall info', () => {
    const payload: VendorStallSaveRequest = {
      brandName: '小集日',
      contactName: '王小明',
      contactPhone: '0912345678',
      contactEmail: 'vendor@example.com',
      city: '臺中市',
      district: '西屯區',
      address: '市政路 1 號',
      instagramUrl: null,
      facebookUrl: null,
      websiteUrl: null,
      avatarImageUrl: null,
      coverImageUrl: null,
      brandSummary: '品牌簡介',
      brandDescription: '品牌介紹',
      brandType: '文創手作',
      products: [],
    };

    service.saveVendorStallInfo(payload).subscribe();

    const request = httpTesting.expectOne(`${environment.apiBaseUrl}api/vendor/stall/save`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(payload);
    request.flush({ statusCode: 200, message: 'ok', messageDetails: null, data: payload });
  });
});
