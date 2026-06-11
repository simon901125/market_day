import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNotification } from './dashboard-notification';

describe('DashboardNotification', () => {
  let component: DashboardNotification;
  let fixture: ComponentFixture<DashboardNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
