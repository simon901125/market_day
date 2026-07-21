import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandDetail } from './user-brand-detail';
import { provideRouter } from '@angular/router';
import { AlertService } from '../../../../../core/services/alert.service';
import { UserBrandApiService } from '../../../services/user-brand-api.service';

describe('UserBrandDetail', () => {
  let component: UserBrandDetail;
  let fixture: ComponentFixture<UserBrandDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandDetail],
      providers: [
        provideRouter([]),
        { provide: UserBrandApiService, useValue: { getBrandDetail: () => undefined } },
        { provide: AlertService, useValue: { error: () => Promise.resolve() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not fall back to a fake brand', () => {
    expect(component.brand).toBeNull();
  });

  it('should expose an empty market record list without a brand', () => {
    expect(component.marketRecords).toEqual([]);
  });
});
