import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UserFooter } from './user-footer';

describe('UserFooter', () => {
  let component: UserFooter;
  let fixture: ComponentFixture<UserFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFooter],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
