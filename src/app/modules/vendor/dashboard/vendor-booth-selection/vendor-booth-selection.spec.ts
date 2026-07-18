import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import type { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import type { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import type { AlertService } from '../../../../core/services/alert.service';
import type { VendorApplicationApiDetail } from '../../../../models/interface/vendor/VendorApplicationApiDetail';
import type { VendorMarketDetail } from '../../../../models/interface/vendor/VendorMarketDetail';
import { VendorBoothSelection } from './vendor-booth-selection';

describe('VendorBoothSelection', () => {
  it('reloads the selected activity and creates days from its dates', () => {
    const route = {
      snapshot: {
        paramMap: convertToParamMap({ applicationNo: 'MD20260801001' }),
        queryParamMap: convertToParamMap({ applicationId: '25' }),
      },
    };
    const router = { navigate: jasmine.createSpy('navigate') };
    const dashboardService = {
      getVendorApplicationDetail: jasmine.createSpy('getVendorApplicationDetail').and.returnValue(of({
        statusCode: 200,
        message: 'ok',
        messageDetails: null,
        data: { event: { eventId: 82 } } as VendorApplicationApiDetail,
      })),
    };
    const vendorService = {
      getMarketDetail: jasmine.createSpy('getMarketDetail').and.returnValue(of({
        statusCode: 200,
        message: 'ok',
        messageDetails: null,
        data: {
          eventTitle: '城市選物市集',
          locationName: '關新公園',
          address: '測試路 100 號',
          startAt: '2026-08-01T10:00:00',
          endAt: '2026-08-02T18:00:00',
          maxBooths: 20,
          dailyAvailability: [
            { applyDate: '2026-08-01', totalStalls: 20, remainingStalls: 19 },
            { applyDate: '2026-08-02', totalStalls: 20, remainingStalls: 18 },
          ],
        } as VendorMarketDetail,
      })),
    };
    const alert = { error: jasmine.createSpy('error') };

    const component = new VendorBoothSelection(
      route as never,
      router as never,
      dashboardService as unknown as VendorDashboardService,
      vendorService as unknown as VendorService,
      alert as unknown as AlertService,
    );

    component.ngOnInit();

    expect(dashboardService.getVendorApplicationDetail).toHaveBeenCalledOnceWith(25);
    expect(vendorService.getMarketDetail).toHaveBeenCalledOnceWith(82);
    expect(component.dateOptions).toEqual(['2026-08-01', '2026-08-02']);
    expect(component.activityTitle).toBe('城市選物市集');
    expect(component.activityAddress).toBe('關新公園');
    expect(component.boothTotal).toBe(20);
    expect(component.isLoading).toBeFalse();
  });
});
