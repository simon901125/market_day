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

  it('should have 3 mock products', () => {
    expect(component.mockProducts.length).toBe(3);
  });

  it('should have 3 mock market records', () => {
    expect(component.mockMarketRecords.length).toBe(3);
  });

  it('getDaysRemaining should return a non-negative number', () => {
    const result = component.getDaysRemaining('2099/12/31');
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
