import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMarketCard } from './user-market-card';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
