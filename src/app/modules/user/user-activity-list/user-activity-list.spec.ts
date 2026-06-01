import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityList } from './user-activity-list';

describe('UserActivityList', () => {
  let component: UserActivityList;
  let fixture: ComponentFixture<UserActivityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
