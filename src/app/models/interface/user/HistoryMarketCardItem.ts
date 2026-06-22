import { MarketCardItem } from '../shared/MarketCardItem';

/** 歷史市集卡片項目 */
export interface HistoryMarketCardItem extends MarketCardItem {
  /** 卡片簡短描述 */
  desc: string;
}
