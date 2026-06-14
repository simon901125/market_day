import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMarketSearchPanel } from './user-market-search-panel';

describe('UserMarketSearchPanel', () => {
  let component: UserMarketSearchPanel;
  let fixture: ComponentFixture<UserMarketSearchPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMarketSearchPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMarketSearchPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
