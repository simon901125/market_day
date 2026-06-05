/** 活動管理狀態 */
export class ActivityStatus {
  /** 草稿 */
  static readonly draft = '草稿';
  /** 待審核 */
  static readonly pendingReview = '待審核';
  /** 補件中 */
  static readonly revisionRequired = '補件中';
  /** 地圖建置中 */
  static readonly mapBuilding = '地圖建置中';
  /** 待發布 */
  static readonly readyToPublish = '待發布';
  /** 報名中 */
  static readonly registrationOpen = '報名中';
  /** 已額滿 */
  static readonly full = '已額滿';
  /** 品牌已公開 */
  static readonly published = '品牌已公開';
  /** 進行中 */
  static readonly active = '進行中';
  /** 已結束 */
  static readonly ended = '已結束';
  /** 已下架 */
  static readonly unpublished = '已下架';
}