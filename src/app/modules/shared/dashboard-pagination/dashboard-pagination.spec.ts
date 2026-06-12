import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPagination } from './dashboard-pagination';

describe('DashboardPagination', () => {
  let component: DashboardPagination;
  let fixture: ComponentFixture<DashboardPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
