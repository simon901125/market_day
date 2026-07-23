import type { Page, Route } from '@playwright/test';
import type { VendorApplicationApiDetail } from '../src/app/models/interface/vendor/VendorApplicationApiDetail';
import type { VendorMarketDetail } from '../src/app/models/interface/vendor/VendorMarketDetail';
import type {
  VendorMarketSearchItem,
  VendorMarketSearchResponse,
} from '../src/app/models/interface/vendor/VendorMarketSearch';
import type { VendorStallMap } from '../src/app/models/interface/vendor/VendorStallMap';
import { createUnsignedJwt } from './auth-test-helpers';

export const VENDOR_EVENT_ID = 101;
export const VENDOR_APPLICATION_ID = 25;
export const VENDOR_APPLICATION_NO = 'MD-E2E-00025';

export const vendorUser = {
  email: 'vendor.flow@example.test',
  name: 'E2E 攤主',
  role: 'VENDOR',
  status: 'ACTIVE',
  isLogin: true,
  provider: 'LOCAL',
} as const;

export function apiResult<T>(
  data: T,
  options: { statusCode?: number; message?: string; messageDetails?: string | null } = {},
) {
  return {
    statusCode: options.statusCode ?? 200,
    message: options.message ?? 'ok',
    messageDetails: options.messageDetails ?? null,
    data,
  };
}

export async function fulfillApi<T>(
  route: Route,
  data: T,
  options: {
    statusCode?: number;
    message?: string;
    messageDetails?: string | null;
    httpStatus?: number;
  } = {},
): Promise<void> {
  await route.fulfill({
    status: options.httpStatus ?? 200,
    contentType: 'application/json; charset=utf-8',
    body: JSON.stringify(apiResult(data, options)),
  });
}

export async function installVendorShellStubs(
  page: Page,
  options: { needsProfile?: boolean; missingProfile?: boolean } = {},
): Promise<void> {
  const token = createUnsignedJwt({
    sub: 'vendor-e2e',
    role: 'VENDOR',
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  await page.addInitScript(({ sessionToken, user }) => {
    localStorage.setItem('MarketDayToken_vendor', sessionToken);
    localStorage.setItem('MarketDayUser_vendor', JSON.stringify(user));
  }, { sessionToken: token, user: vendorUser });

  await page.route('**/api/auth/me', (route) => fulfillApi(route, { user: vendorUser }));
  await page.route('**/api/vendor/dashboard/init', (route) => fulfillApi(route, {
    needsProfile: options.needsProfile ?? false,
    guideMessage: options.needsProfile ? '請先完成攤位資料' : null,
    name: vendorUser.name,
    pendingReviewCount: 0,
    pendingPaymentCount: 0,
    pendingStallSelectionCount: 0,
    pendingRefundCount: 0,
    notifications: [],
  }));
  await page.route('**/api/addresses/cities', (route) => fulfillApi(route, ['臺北市', '臺中市']));
  await page.route('**/api/addresses/districts?*', (route) => fulfillApi(route, ['中正區', '西屯區']));

  if (options.missingProfile ?? true) {
    await page.route('**/api/vendor/stall/load', (route) => fulfillApi(route, null, {
      statusCode: 404,
      message: '找不到攤位資料',
    }));
  }
}

export async function installVendorPublicStubs(page: Page): Promise<void> {
  await page.route('**/api/addresses/cities', (route) =>
    fulfillApi(route, ['臺北市', '臺中市']),
  );
  await page.route('**/api/addresses/districts?*', (route) =>
    fulfillApi(route, ['中正區', '西屯區']),
  );
}

export function createMarketDetail(
  overrides: Partial<VendorMarketDetail> = {},
): VendorMarketDetail {
  return {
    eventId: VENDOR_EVENT_ID,
    eventTitle: 'E2E 夏日手作市集',
    summary: '適合文創品牌參加的測試市集',
    description: '這是攤主 E2E 測試使用的活動資料。',
    locationName: '測試展演廣場',
    city: '臺北市',
    district: '中正區',
    address: '測試路 1 號',
    notice: '請依規定時間完成報到。',
    startAt: '2026-08-01T10:00:00',
    endAt: '2026-08-02T18:00:00',
    registrationStartAt: '2026-07-01T09:00:00',
    registrationEndAt: '2026-07-28T23:59:00',
    maxBooths: 20,
    baseFee: 650,
    depositAmount: 1000,
    coverImageUrl: '/assets/images/market/cards/market-card-01.png',
    mapImageUrl: null,
    categories: [{ id: 2, name: '文創手作', slug: 'handmade' }],
    categoryName: '文創手作',
    organizerName: 'E2E 主辦方',
    companyName: 'E2E 市集公司',
    serviceDays: '週六、週日',
    serviceStartTime: '09:00',
    serviceEndTime: '18:00',
    contactName: '測試窗口',
    contactPhone: '0212345678',
    contactEmail: 'organizer@example.test',
    stallWidth: 3,
    stallLength: 3,
    stallHeight: 2.5,
    registrationStatus: 'OPEN',
    dailyAvailability: [
      { applyDate: '2026-08-01', totalStalls: 20, remainingStalls: 8 },
      { applyDate: '2026-08-02', totalStalls: 20, remainingStalls: 7 },
    ],
    equipments: [
      {
        eventEquipmentId: 11,
        equipmentGroupKey: 'table',
        name: '展示桌',
        description: '180 × 60 公分',
        rentalFee: 200,
        pricingUnit: 'EVENT',
        unit: '張',
        chargeType: 'PAID',
        itemType: 'EQUIPMENT',
        stockQuantity: 10,
        perStallRentalLimit: 2,
        wattageLimit: null,
      },
      {
        eventEquipmentId: 21,
        equipmentGroupKey: 'power-110',
        name: '110V 額外用電',
        description: null,
        rentalFee: 200,
        pricingUnit: 'EVENT',
        unit: '組',
        chargeType: 'PAID',
        itemType: 'POWER',
        stockQuantity: null,
        perStallRentalLimit: 1,
        wattageLimit: 1000,
      },
    ],
    trafficInfos: [{ id: 1, trafficTitle: '捷運', trafficDetails: '步行約 5 分鐘' }],
    ...overrides,
  };
}

export function createMarketSearchItem(
  detail = createMarketDetail(),
  overrides: Partial<VendorMarketSearchItem> = {},
): VendorMarketSearchItem {
  return {
    eventId: detail.eventId,
    eventTitle: detail.eventTitle,
    summary: detail.summary,
    locationName: detail.locationName,
    city: detail.city,
    district: detail.district,
    address: detail.address,
    maxBooths: detail.maxBooths,
    startAt: detail.startAt,
    endAt: detail.endAt,
    registrationStartAt: detail.registrationStartAt,
    registrationEndAt: detail.registrationEndAt,
    baseFee: detail.baseFee,
    trafficTitle: detail.trafficInfos[0]?.trafficTitle ?? null,
    trafficDetail: detail.trafficInfos[0]?.trafficDetails ?? null,
    categories: detail.categories,
    categoryName: detail.categoryName,
    organizerName: detail.organizerName,
    imageUrl: detail.coverImageUrl,
    registrationStatus: detail.registrationStatus,
    ...overrides,
  };
}

export function createMarketSearchResponse(
  items: VendorMarketSearchItem[],
  options: { page?: number; pageSize?: number; totalItems?: number } = {},
): VendorMarketSearchResponse {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 6;
  const totalItems = options.totalItems ?? items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  return {
    markets: {
      items,
      page,
      pageSize,
      totalItems,
      totalPages,
      hasPrevious: page > 1,
      hasNext: page < totalPages,
    },
  };
}

export async function stubMarketDetail(
  page: Page,
  detail = createMarketDetail(),
): Promise<void> {
  await page.route(`**/api/vendor/markets/${detail.eventId}`, (route) => fulfillApi(route, detail));
}

export function createApplicationDetail(
  applicationStatus = '待付款',
  options: { selected?: boolean; paymentStatus?: string | null } = {},
): VendorApplicationApiDetail {
  const selected = options.selected ?? ['報名完成', '保證金已退還'].includes(applicationStatus);
  const paid = !['待審核', '待付款', '審核未通過', '已取消'].includes(applicationStatus);

  return {
    application: {
      applicationId: VENDOR_APPLICATION_ID,
      applicationNo: VENDOR_APPLICATION_NO,
      applicationStatus,
    },
    event: {
      eventId: VENDOR_EVENT_ID,
      eventCoverImageUrl: '/assets/images/market/cards/market-card-01.png',
      eventTitle: 'E2E 夏日手作市集',
      eventStatus: '活動準備中',
      statusNote: '報名中',
      eventTime: '2026/08/01 - 2026/08/02',
      eventStartAt: '2026-08-01T10:00:00',
      eventEndAt: '2026-08-02T18:00:00',
      locationName: '臺北市中正區 測試展演廣場',
      address: '臺北市中正區測試路 1 號',
    },
    vendor: {
      vendorOwnerName: vendorUser.name,
      vendorPhone: '0912345678',
      vendorEmail: vendorUser.email,
      address: '臺北市中正區測試路 2 號',
    },
    brand: {
      brandName: 'E2E 測試品牌',
      categoryName: '文創手作',
      brandDescription: 'E2E 品牌介紹',
    },
    applicationdetail: {
      registrationPeriods: '2026-08-01 10:00-18:00',
      width: 3,
      length: 3,
      stallZone: selected ? 'A 區' : null,
      stallCategory: '文創手作',
      vehicleNo: 'ABC-1234',
      applicantNote: 'E2E 報名備註',
      reviewNote: null,
      reviewNoteDetail: null,
    },
    stall: [{
      applyDate: '2026-08-01',
      stallNo: selected ? 'A01' : null,
      zoneName: selected ? 'A 區' : null,
      selectionStatus: selected ? '已選位' : '未選位',
    }],
    fee: {
      paymentStatus: options.paymentStatus ?? (paid ? '已付款' : '待付款'),
      paymentMethod: paid ? '信用卡' : null,
      paymentNo: paid ? 'PAY-E2E-00025' : null,
      providerTradeNo: paid ? 'NP-E2E-00025' : null,
      paidAt: paid ? '2026-07-20T12:00:00' : null,
      paymentAmount: 1650,
    },
    refund: {
      refundStatus: null,
      refundStatusText: null,
      refundMethod: null,
      refundNo: null,
      refundAmount: null,
      refundedAt: null,
    },
    feedetail: [
      { item: '報名費', content: '1 天', amount: 650 },
      { item: '保證金', content: '活動保證金', amount: 1000 },
      { item: '總計', content: null, amount: 1650 },
    ],
    equipmentRentals: {
      freeEquipments: [],
      freeBasicPower: [],
      rentalEquipments: [],
      extraPower: [],
    },
    status: [{
      key: 'APPLIED',
      label: '報名送出',
      value: '已送出',
      createdAt: '2026-07-10T10:30:00',
    }],
  };
}

export async function stubApplicationDetail(
  page: Page,
  detail: VendorApplicationApiDetail,
): Promise<void> {
  await page.route(
    `**/api/vendor/applications/${detail.application.applicationId}`,
    (route) => fulfillApi(route, detail),
  );
}

export function createStallMap(selected = false): VendorStallMap {
  return {
    application: {
      applicationNo: VENDOR_APPLICATION_NO,
      applicationStatus: selected ? '報名完成' : '待選位',
      vendorName: 'E2E 測試品牌',
      currentApplyDate: '2026-08-01',
      applyDates: '2026-08-01',
      applyDateCount: 1,
      selectedStalls: selected
        ? [{ selectedStallId: 1, applyDate: '2026-08-01', stallNo: 'A01', zoneName: 'A 區', width: 3, length: 3 }]
        : [],
      alreadyselectdate: selected ? ['2026-08-01'] : [],
    },
    event: {
      eventTitle: 'E2E 夏日手作市集',
      startAt: '2026-08-01T10:00:00',
      endAt: '2026-08-01T18:00:00',
      address: '臺北市中正區測試路 1 號',
    },
    stalls: [
      {
        stallId: 1,
        zoneId: 1,
        zoneName: 'A 區',
        stallNo: 'A01',
        width: 3,
        length: 3,
        status: selected ? 'SELECTED' : 'AVAILABLE',
        selectedApplicationId: selected ? VENDOR_APPLICATION_ID : null,
      },
      {
        stallId: 2,
        zoneId: 1,
        zoneName: 'A 區',
        stallNo: 'A02',
        width: 3,
        length: 3,
        status: 'SELECTED',
        selectedApplicationId: 999,
      },
    ],
  };
}
