import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBrandSearchCard } from './user-brand-search-card';

describe('UserBrandSearchCard', () => {
  let component: UserBrandSearchCard;
  let fixture: ComponentFixture<UserBrandSearchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandSearchCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBrandSearchCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
