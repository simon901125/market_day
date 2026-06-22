/** 品牌 / 市集類型 */
export class BrandType {
  static readonly food = '餐飲美食';
  static readonly handmade = '文創手作';
  static readonly family = '親子家庭';
  static readonly pet = '寵物生活';
  static readonly plant = '植物選物';
  static readonly fashion = '服飾配件';
  static readonly toy = '玩具選物';

  static readonly list: string[] = [
    BrandType.food,
    BrandType.handmade,
    BrandType.family,
    BrandType.pet,
    BrandType.plant,
    BrandType.fashion,
    BrandType.toy,
  ];

  static readonly filterList: string[] = [
    '全部品牌',
    ...BrandType.list,
  ];
}
