import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHistoryMarketCard } from './user-history-market-card';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
