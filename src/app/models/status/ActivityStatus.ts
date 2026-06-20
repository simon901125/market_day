/** 活動狀態文字、篩選選項與標籤樣式 */
export class ActivityStatus {
  /** 篩選用的全部狀態選項 */
  static readonly all = '全部狀態';

  /** 活動狀態 */
  static readonly draft = '草稿';
  static readonly pendingReview = '待審核';
  static readonly revisionRequired = '補件中';
  static readonly mapBuilding = '地圖建置中';
  static readonly readyToPublish = '待發布';
  static readonly registrationOpen = '報名中';
  static readonly full = '已額滿';
  static readonly published = '品牌已公開';
  static readonly active = '進行中';
  static readonly ended = '已結束';
  static readonly unpublished = '已下架';

  /** 不含「全部狀態」的活動狀態清單 */
  static readonly list: string[] = [
    ActivityStatus.draft,
    ActivityStatus.pendingReview,
    ActivityStatus.revisionRequired,
    ActivityStatus.mapBuilding,
    ActivityStatus.readyToPublish,
    ActivityStatus.registrationOpen,
    ActivityStatus.full,
    ActivityStatus.published,
    ActivityStatus.active,
    ActivityStatus.ended,
    ActivityStatus.unpublished,
  ];

  /** 活動管理篩選下拉選單使用的狀態清單 */
  static readonly filterList: string[] = [
    ActivityStatus.all,
    ...ActivityStatus.list,
  ];

  /** 活動狀態對應的共用標籤樣式 */
  static readonly classMap: Record<string, string> = {
    [ActivityStatus.draft]: 'tag-grey',
    [ActivityStatus.pendingReview]: 'tag-orange',
    [ActivityStatus.revisionRequired]: 'tag-red',
    [ActivityStatus.mapBuilding]: 'tag-blue',
    [ActivityStatus.readyToPublish]: 'tag-purple',
    [ActivityStatus.registrationOpen]: 'tag-green',
    [ActivityStatus.full]: 'tag-orange',
    [ActivityStatus.published]: 'tag-teal',
    [ActivityStatus.active]: 'tag-blue',
    [ActivityStatus.ended]: 'tag-grey',
    [ActivityStatus.unpublished]: 'tag-red',
  };

  /** 取得活動狀態標籤樣式 */
  static getClass(status: string): string {
    return ActivityStatus.classMap[status] ?? 'tag-grey';
  }
}
