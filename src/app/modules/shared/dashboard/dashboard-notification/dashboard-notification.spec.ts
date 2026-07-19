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

  it('markAsRead 對未讀通知應設為已讀並觸發 markRead 事件', () => {
    const markReadSpy = jasmine.createSpy('markRead');
    component.markRead.subscribe(markReadSpy);
    const item = { id: 1, unread: true, icon: '', status: '', title: '', date: '' };

    component.markAsRead(item);

    expect(item.unread).toBeFalse();
    expect(markReadSpy).toHaveBeenCalledWith(item);
  });

  it('markAsRead 對已讀通知不應重複觸發 markRead 事件', () => {
    const markReadSpy = jasmine.createSpy('markRead');
    component.markRead.subscribe(markReadSpy);
    const item = { id: 1, unread: false, icon: '', status: '', title: '', date: '' };

    component.markAsRead(item);

    expect(markReadSpy).not.toHaveBeenCalled();
  });
});
