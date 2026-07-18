/** 管理員操作紀錄-操作對象類型 */
export class LogTargetType {
  /** 系統 */
  static readonly system = '系統';
  /** 活動 */
  static readonly event = '活動';
  /** 主辦方 */
  static readonly organizer = '主辦方';
  /** 攤主 */
  static readonly vendor = '攤主';

  /** 對象類型 -> 標籤顏色 class 對應 */
  static readonly classMap: Record<string, string> = {
    [LogTargetType.system]: 'system',
    [LogTargetType.event]: 'event',
    [LogTargetType.organizer]: 'organizer',
    [LogTargetType.vendor]: '',
  };

  /** 取得對象類型對應的標籤顏色 class */
  static getClass(type: string): string {
    return LogTargetType.classMap[type] ?? '';
  }

  /** 後端 AdminTargetTypeForFront 的 API 值（英文 key，注意攤主是 vender）對應到前端顯示用的中文標籤。 */
  static readonly apiTargetTypeMap: Record<string, string> = {
    systemSetting: LogTargetType.system,
    marketEvent: LogTargetType.event,
    organizer: LogTargetType.organizer,
    vender: LogTargetType.vendor,
  };

  /** 把後端回傳的 AdminTargetTypeForFront API 值轉成畫面用的中文標籤。 */
  static fromApiTargetType(type: string): string {
    return LogTargetType.apiTargetTypeMap[type] ?? type;
  }

  /** 把畫面上的中文對象類型標籤轉成要送給後端的 AdminTargetTypeForFront API 值。 */
  static toApiTargetType(label: string): string | null {
    const entry = Object.entries(LogTargetType.apiTargetTypeMap).find(([, value]) => value === label);
    return entry ? entry[0] : null;
  }
}
