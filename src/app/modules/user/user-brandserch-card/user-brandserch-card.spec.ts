import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandserchCard } from './user-brandserch-card';

describe('UserBrandserchCard', () => {
  let component: UserBrandserchCard;
  let fixture: ComponentFixture<UserBrandserchCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandserchCard],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandserchCard);
    component = fixture.componentInstance;
    component.brand = {
      name: '品一好食主意',
      description: '精選手工點心，從台灣在地食材出發，用心製作每一口。',
      tags: ['手作', '文創', '小點'],
      historyMarkets: [],
      image: '',
      logo: '',
      goodat_works: '手工甜塔、布丁',
      masterpiece: '限定甜塔系列',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
