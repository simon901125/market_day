/**
 * 通知事件類型（對應後端 NotificationType，攤主、主辦方、管理員共用）與圖示、狀態文字的對照表
 */
export interface NoticeTypeDisplay {
  icon: string;
  iconClass: string;
  status: string;
}

const NOTICE_TYPE_DISPLAY_MAP: Record<string, NoticeTypeDisplay> = {
  /**主辦方資格申請已送出 */
  organizerRegistrationSubmitted: { icon: 'bi bi-person-badge', iconClass: 'orange', status: '新申請' },
  /**主辦方資料已重新送出審核 */
  organizerProfileResubmitted: { icon: 'bi bi-person-badge', iconClass: 'blue', status: '補件完成' },
  /**活動已送出審核 */
  eventSubmitted: { icon: 'bi bi-calendar-check', iconClass: 'orange', status: '新活動' },
  /**活動已重新送出審核 */
  eventResubmitted: { icon: 'bi bi-calendar-check', iconClass: 'blue', status: '補件完成' },
  /**活動審核通過，進入地圖建置 */
  eventApproved: { icon: 'bi bi-flag', iconClass: 'green', status: '審核通過' },
  /**活動審核未通過，需補件 */
  eventRevisionRequired: { icon: 'bi bi-exclamation-triangle', iconClass: 'red', status: '需補件' },
  /**活動攤位地圖建置完成 */
  eventMapCompleted: { icon: 'bi bi-map', iconClass: 'green', status: '地圖完成' },
  /**攤位申請已送出 */
  applicationSubmitted: { icon: 'bi bi-shop-window', iconClass: 'orange', status: '新申請' },
  /**攤位申請已重新送出 */
  applicationResubmitted: { icon: 'bi bi-shop-window', iconClass: 'blue', status: '補件完成' },
  /**攤位申請已通過 */
  applicationApproved: { icon: 'bi bi-shop-window', iconClass: 'green', status: '審核通過' },
  /**攤位申請已拒絕 */
  applicationRejected: { icon: 'bi bi-shop-window', iconClass: 'red', status: '已拒絕' },
  /**攤位申請已取消 */
  applicationCancelled: { icon: 'bi bi-shop-window', iconClass: 'red', status: '已取消' },
  /**付款成功 */
  paymentPaid: { icon: 'bi bi-wallet2', iconClass: 'green', status: '付款成功' },
  /**付款失敗 */
  paymentFailed: { icon: 'bi bi-wallet2', iconClass: 'red', status: '付款失敗' },
  /**付款逾期 */
  paymentExpired: { icon: 'bi bi-wallet2', iconClass: 'red', status: '付款逾期' },
  /**可開放選擇攤位 */
  stallSelectionAvailable: { icon: 'bi bi-grid-3x3-gap', iconClass: 'blue', status: '可選攤位' },
  /**攤位選擇已完成 */
  stallSelectionCompleted: { icon: 'bi bi-grid-3x3-gap', iconClass: 'green', status: '選位完成' },
  /**報名流程已完成 */
  applicationCompleted: { icon: 'bi bi-check-circle', iconClass: 'green', status: '報名完成' },
  /**活動內容已更新 */
  eventUpdated: { icon: 'bi bi-pencil-square', iconClass: 'blue', status: '活動更新' },
  /**活動已下架 */
  eventUnpublished: { icon: 'bi bi-arrow-down', iconClass: 'red', status: '已下架' },
  /**活動已取消 */
  eventCancelled: { icon: 'bi bi-x-circle', iconClass: 'red', status: '已取消' },
  /**活動已結束 */
  eventEnded: { icon: 'bi bi-calendar-x', iconClass: 'blue', status: '已結束' },
  /**活動下架申請退回，需補件 */
  eventUnpublishRequestRevisionRequired: { icon: 'bi bi-arrow-down', iconClass: 'red', status: '需補件' },
  /**退款已申請 */
  refundRequested: { icon: 'bi bi-cash-coin', iconClass: 'orange', status: '退款申請' },
  /**退款處理中 */
  refunding: { icon: 'bi bi-cash-coin', iconClass: 'blue', status: '退款處理中' },
  /**退款失敗 */
  refundFailed: { icon: 'bi bi-cash-coin', iconClass: 'red', status: '退款失敗' },
  /**退款已完成 */
  refunded: { icon: 'bi bi-cash-coin', iconClass: 'green', status: '退款完成' },
  /**系統公告 */
  systemAnnouncement: { icon: 'bi bi-megaphone', iconClass: 'purple', status: '系統公告' },
  /**系統例外事件通知 */
  systemException: { icon: 'bi bi-exclamation-triangle', iconClass: 'red', status: '異常提醒' },
  /**登入異常 */
  loginAnomaly: { icon: 'bi bi-shield-exclamation', iconClass: 'red', status: '登入異常' },
  /**密碼重設完成 */
  passwordResetCompleted: { icon: 'bi bi-shield-check', iconClass: 'blue', status: '密碼已重設' },
};

const DEFAULT_NOTICE_TYPE_DISPLAY: NoticeTypeDisplay = {
  icon: 'bi bi-bell',
  iconClass: 'blue',
  status: '系統通知',
};

const NOTICE_STATUS_CLASS_BY_ICON_COLOR: Record<string, string> = {
  orange: 'pending',
  green: 'success',
  red: 'cancel',
  blue: 'info',
  purple: 'info',
};

/** 依通知事件類型（notice.type）取得畫面用的圖示與狀態文字 */
export function getNoticeTypeDisplay(type: string): NoticeTypeDisplay {
  return NOTICE_TYPE_DISPLAY_MAP[type] ?? DEFAULT_NOTICE_TYPE_DISPLAY;
}

/** 依圖示顏色換算狀態標籤樣式 class */
export function getNoticeStatusClass(iconClass: string): string {
  return NOTICE_STATUS_CLASS_BY_ICON_COLOR[iconClass] ?? 'info';
}
