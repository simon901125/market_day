import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityDetail } from './user-activity-detail';

describe('UserActivityDetail', () => {
  let component: UserActivityDetail;
  let fixture: ComponentFixture<UserActivityDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
