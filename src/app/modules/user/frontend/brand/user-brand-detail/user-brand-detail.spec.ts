import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandDetail } from './user-brand-detail';
import { provideRouter } from '@angular/router';

describe('UserBrandDetail', () => {
  let component: UserBrandDetail;
  let fixture: ComponentFixture<UserBrandDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandDetail],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use the selected brand products', () => {
    expect(component.brand.products.length).toBe(3);
  });

  it('should create market records from the selected brand history', () => {
    expect(component.marketRecords.length).toBe(component.brand.historyMarkets.length);
    expect(component.marketRecords[0].name).toBe('草悟野餐市集');
  });
});
