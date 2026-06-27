/** 主辦方後台活動流程狀態。 */
export class ActivityStatus {
  /** 活動管理篩選：全部狀態。 */
  static readonly all = '全部狀態';

  /** 活動建立與審核流程狀態。 */
  static readonly draft = '草稿';
  static readonly pendingReview = '待審核';
  static readonly revisionRequired = '補件中';
  static readonly mapBuilding = '地圖建置中';
  static readonly readyToPublish = '待發布';

  /** 活動公開後狀態。 */
  static readonly registrationOpen = '報名中';
  static readonly full = '已額滿';
  static readonly published = '品牌已公開';
  static readonly active = '進行中';
  static readonly ended = '已結束';
  static readonly pendingUnpublish = '下架申請中';
  static readonly unpublished = '已下架';

  /** 所有可顯示的活動狀態。 */
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
    ActivityStatus.pendingUnpublish,
    ActivityStatus.unpublished,
  ];

  /** 活動管理篩選下拉選項。 */
  static readonly filterList: string[] = [
    ActivityStatus.all,
    ...ActivityStatus.list,
  ];

  /** 活動狀態對應標籤樣式。 */
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
    [ActivityStatus.pendingUnpublish]: 'tag-orange',
    [ActivityStatus.unpublished]: 'tag-red',
  };

  /** 取得活動狀態標籤樣式。 */
  static getClass(status: string): string {
    return ActivityStatus.classMap[status] ?? 'tag-grey';
  }
}
