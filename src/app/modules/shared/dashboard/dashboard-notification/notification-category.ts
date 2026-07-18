/**
 * 通知分類（對應後端 NotificationCategory，攤主、主辦方、管理員共用）
 */
export type NotificationCategory =
  | 'exception'
  | 'system'
  | 'eventManagement'
  | 'organizerManagement'
  | 'eventChange'
  | 'stallAssignment'
  | 'payment'
  | 'registration'
  | 'applicationReview';

export const NOTIFICATION_CATEGORY_LABEL: Record<NotificationCategory, string> = {
  /**異常事件 */
  exception: '異常',
  /**系統通知 */
  system: '系統',
  /**活動管理 */
  eventManagement: '活動管理',
  /**主辦方管理 */
  organizerManagement: '主辦方管理',
  /**活動異動 */
  eventChange: '活動異動',
  /**攤位分配 */
  stallAssignment: '攤位分配',
  /**款項 */
  payment: '款項',
  /**報名 */
  registration: '報名',
  /**攤主申請審核 */
  applicationReview: '攤主申請',
};
