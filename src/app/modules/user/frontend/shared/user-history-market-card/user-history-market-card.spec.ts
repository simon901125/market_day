import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryMarketCardItem } from '../../../../../models/interface/user/HistoryMarketCardItem';
import { UserHistoryMarketCard } from './user-history-market-card';

const market: HistoryMarketCardItem = {
  id: '1',
  title: '歷史測試市集',
  time: '10:00 - 18:00',
  start_date: '2025/07/21',
  end_date: '2025/07/21',
  description: '歷史測試活動',
  desc: '歷史測試活動',
  location: '台北市',
  address: '測試地址',
  city: '台北市',
  area: '中正區',
  image: 'assets/images/market/cards/market-card-01.png',
  status: '已結束',
  statusClass: 'ended',
  tags: ['手作設計'],
  category: '手作設計',
  organizer: '測試主辦方',
  transportation: [],
};

describe('UserHistoryMarketCard', () => {
  let component: UserHistoryMarketCard;
  let fixture: ComponentFixture<UserHistoryMarketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHistoryMarketCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHistoryMarketCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('market', market);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
