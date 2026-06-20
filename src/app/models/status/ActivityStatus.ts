export class ActivityStatus {
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

  static getClass(status: string): string {
    return ActivityStatus.classMap[status] ?? 'tag-grey';
  }
}
