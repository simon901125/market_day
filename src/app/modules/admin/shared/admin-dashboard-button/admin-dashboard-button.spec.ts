import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardButton } from './admin-dashboard-button';

describe('AdminDashboardButton', () => {
  let component: AdminDashboardButton;
  let fixture: ComponentFixture<AdminDashboardButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardButton],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('type 為 search 時，應顯示搜尋圖示與「搜尋」文字', () => {
    component.type = 'search';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.bi-search')).toBeTruthy();
    expect(el.querySelector('span')?.textContent).toContain('搜尋');
  });

  it('type 為 clear 時，應顯示「清除條件」文字', () => {
    component.type = 'clear';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('span')?.textContent).toContain('清除條件');
  });

  it('type 為 primary 時，應顯示 text 輸入的文字', () => {
    component.type = 'primary';
    component.text = '新增市集';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('span')?.textContent).toContain('新增市集');
  });

  it('type 為 secondary 時，應顯示 text 輸入的文字', () => {
    component.type = 'secondary';
    component.text = '取消';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('span')?.textContent).toContain('取消');
  });

  it('點擊按鈕時，應呼叫 todo 函式', () => {
    const todoSpy = jasmine.createSpy('todo');
    component.todo = todoSpy;
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(todoSpy).toHaveBeenCalledTimes(1);
  });

  it('按鈕應套用對應 type 的 CSS class', () => {
    component.type = 'secondary';
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('secondary');
  });
});
