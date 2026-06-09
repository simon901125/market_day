/** 品牌類型 */
export class BrandType {
  /** 餐飲美食 */
  static readonly food = '餐飲美食';
  /** 文創手作 */
  static readonly handmade = '文創手作';
  /** 親子家庭 */
  static readonly family = '親子家庭';
  /** 寵物生活 */
  static readonly pet = '寵物生活';
  /** 植物選物 */
  static readonly plant = '植物選物';
  /** 服飾配件 */
  static readonly fashion = '服飾配件';
  /** 玩具選物 */
  static readonly toy = '玩具選物';
  /** 全部類型 */
  static readonly list: string[] = [
    BrandType.food,
    BrandType.handmade,
    BrandType.family,
    BrandType.pet,
    BrandType.plant,
    BrandType.fashion,
    BrandType.toy,
  ];
  /** 市集類型過濾清單 */
  static readonly filterList: string[] = [
    '全部市集',
    ...BrandType.list,
  ];
}