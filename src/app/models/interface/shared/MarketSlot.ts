/** 市集場次攤位資訊 */
export interface MarketSlot {
  /** 場次日期，例如 06/07 */
  date: string;

  /** 剩餘攤位數 */
  remaining: number;

  /** 當日攤位總數 */
  total?: number;

  /** 是否額滿 */
  isFull?: boolean;
}
