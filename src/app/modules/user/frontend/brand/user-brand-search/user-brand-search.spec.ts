import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AlertService } from '../../../../../core/services/alert.service';
import { UserBrandApiService } from '../../../services/user-brand-api.service';
import { UserBrandSearch } from './user-brand-search';

describe('UserBrandSearch', () => {
  let component: UserBrandSearch;
  let fixture: ComponentFixture<UserBrandSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandSearch],
      providers: [
        provideRouter([]),
        {
          provide: UserBrandApiService,
          useValue: {
            searchBrands: () => of({
              statusCode: 200,
              data: {
                totalCount: 0,
                brands: {
                  items: [], page: 1, pageSize: 8, totalItems: 0, totalPages: 0,
                  hasPrevious: false, hasNext: false,
                },
              },
            }),
          },
        },
        { provide: AlertService, useValue: { error: () => Promise.resolve() } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBrandSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
