import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketCardItem } from '../../../../../models/interface/shared/MarketCardItem';
import { UserMarketCard } from './user-market-card';

const market: MarketCardItem = {
  id: '1',
  title: '測試市集',
  time: '10:00 - 18:00',
  start_date: '2026/07/21',
  end_date: '2026/07/21',
  description: '測試活動',
  location: '台北市',
  address: '測試地址',
  city: '台北市',
  area: '中正區',
  image: 'assets/images/market/cards/market-card-01.png',
  status: '目前活動',
  statusClass: 'current',
  tags: ['手作設計'],
  category: '手作設計',
  organizer: '測試主辦方',
  transportation: [],
};

describe('UserMarketCard', () => {
  let component: UserMarketCard;
  let fixture: ComponentFixture<UserMarketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMarketCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMarketCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('market', market);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
