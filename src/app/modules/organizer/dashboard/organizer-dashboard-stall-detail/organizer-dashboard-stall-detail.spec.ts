import { of } from 'rxjs';

import { AlertService } from '../../../../core/services/alert.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerDashboardStallDetail } from './organizer-dashboard-stall-detail';

describe('OrganizerDashboardStallDetail', () => {
  let component: OrganizerDashboardStallDetail;
  let organizerApi: jasmine.SpyObj<OrganizerApiService>;
  let alert: jasmine.SpyObj<AlertService>;

  const booth = {
    code: 'A01',
    zone: 'A 區',
    size: '2m × 2m',
    selected: true,
    brand: '測試品牌',
    category: '餐飲美食',
    vendor: '王小明',
    selectedAt: '2026/07/20 14:30',
  };

  beforeEach(() => {
    organizerApi = jasmine.createSpyObj('OrganizerApiService', [
      'getOrganizerStallDetail',
      'getOrganizerStallMap',
    ]);
    alert = jasmine.createSpyObj('AlertService', ['error']);
    component = new OrganizerDashboardStallDetail(
      {
        snapshot: {
          paramMap: { get: () => null },
          queryParamMap: { get: () => null },
        },
      } as never,
      jasmine.createSpyObj('Router', ['navigate']) as never,
      organizerApi,
      alert,
    );
    component.eventId = 8;
    component.selectedDate = '2026/07/20';
  });

  it('點擊查看品牌應依活動、攤位及日期取得單一攤位詳情', async () => {
    organizerApi.getOrganizerStallDetail.and.returnValue(of({
      statusCode: 200,
      message: '取得成功',
      messageDetails: null,
      data: {
        stall: {
          stallId: 1,
          stallNo: 'A01',
          zoneId: 3,
          zoneName: 'A 區',
          width: 2,
          length: 2,
          status: '已選擇',
          applyDate: '2026-07-20',
          selectedAt: '2026-07-20T14:30:00',
        },
        application: { id: 15 },
        vendor: {
          brandName: '測試品牌',
          category: { id: 1, name: '餐飲美食', slug: 'food' },
          vendorOwnerName: '王小明',
          vendorPhone: '0912345678',
          vendorEmail: 'vendor@example.com',
        },
      },
    }));

    await component.openBrandDetail(booth);

    expect(organizerApi.getOrganizerStallDetail).toHaveBeenCalledWith(
      8,
      'A01',
      '2026-07-20',
    );
    expect(component.selectedStallDetail?.vendor?.brandName).toBe('測試品牌');
    expect(component.brandLoadingStallNo).toBeNull();
  });

  it('後端沒有品牌資料時應顯示錯誤且不開啟視窗', async () => {
    organizerApi.getOrganizerStallDetail.and.returnValue(of({
      statusCode: 200,
      message: '取得成功',
      messageDetails: null,
      data: {
        stall: {
          stallId: 1,
          stallNo: 'A01',
          zoneId: 3,
          zoneName: 'A 區',
          width: 2,
          length: 2,
          status: '可選擇',
          applyDate: '2026-07-20',
          selectedAt: null,
        },
        application: null,
        vendor: null,
      },
    }));

    await component.openBrandDetail(booth);

    expect(alert.error).toHaveBeenCalledWith(
      '無法查看品牌',
      '這個攤位目前沒有可顯示的品牌資料。',
    );
    expect(component.selectedStallDetail).toBeNull();
  });
});
