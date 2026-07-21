import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UserMarketApiService } from '../../../services/user-market-api.service';
import { UserActivityDetail } from './user-activity-detail';

describe('UserActivityDetail', () => {
  let component: UserActivityDetail;
  let fixture: ComponentFixture<UserActivityDetail>;
  let marketApi: jasmine.SpyObj<UserMarketApiService>;

  beforeEach(async () => {
    marketApi = jasmine.createSpyObj<UserMarketApiService>('UserMarketApiService', [
      'getMarketDetail',
      'getMarketDetailByStall',
      'getEventStallsStatus',
    ]);
    marketApi.getEventStallsStatus.and.returnValue(of({ statusCode: 200, data: [] } as any));
    marketApi.getMarketDetailByStall.and.returnValue(of({
      statusCode: 200,
      data: { selectedStall: { brand: null } },
    } as any));

    await TestBed.configureTestingModule({
      imports: [UserActivityDetail],
      providers: [
        provideRouter([]),
        { provide: UserMarketApiService, useValue: marketApi },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the complete stall layout when the activity date changes', () => {
    (component as unknown as { marketId: number }).marketId = 7;
    component.selectedActivityDate = '2026/07/18';

    component.selectActivityDate('2026/07/19');

    expect(marketApi.getEventStallsStatus).toHaveBeenCalledOnceWith(7, '2026-07-19');
    expect(marketApi.getMarketDetailByStall).not.toHaveBeenCalled();
  });

  it('should request brand data only after a booth is selected', () => {
    (component as unknown as { marketId: number }).marketId = 7;
    component.selectedActivityDate = '2026/07/19';

    component.onMapBoothSelected('A01');

    expect(marketApi.getMarketDetailByStall).toHaveBeenCalledOnceWith(7, '2026-07-19', 'A01');
  });
});
