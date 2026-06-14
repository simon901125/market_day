import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBrandSearch } from './user-brand-search';

describe('UserBrandSearch', () => {
  let component: UserBrandSearch;
  let fixture: ComponentFixture<UserBrandSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandSearch]
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
