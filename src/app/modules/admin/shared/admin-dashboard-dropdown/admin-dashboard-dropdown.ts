import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  input,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-dropdown',
  imports: [],
  templateUrl: './admin-dashboard-dropdown.html',
  styleUrl: './admin-dashboard-dropdown.scss',
})
export class AdminDashboardDropdown {

  /** 下拉選單的標籤 */
  @Input() title: string = '';

  /** 下拉選單的選項資料 */
  @Input() options: string[] = [];

  /** 尚未選擇時顯示的提示文字 */
  @Input() placeholder: string = '';

  /** 選擇選項後，將選到的文字傳給父元件 */
  @Output() optionSelected = new EventEmitter<string>();

  /** 控制下拉選單是否展開 */
  isOpen = false;

  /** 鍵盤上下選取時，目前停留的選項索引 */
  activeIndex = -1;

  /** 目前選中的值 */
  selectedValue = '';

  constructor(private el: ElementRef) {}

  /** 顯示在按鈕上的文字，若尚未選擇則顯示 placeholder */
  get displayLabel(): string {
    return this.selectedValue || this.placeholder;
  }

  /** 開啟或關閉下拉選單 */
  toggle(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.activeIndex = -1;
    }
  }

  /** 點擊元件外部時，關閉下拉選單 */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  /** 鍵盤操作：上下選取、Enter 確認、Esc 關閉 */
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % this.options.length;
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex =
          this.activeIndex <= 0 ? this.options.length - 1 : this.activeIndex - 1;
        break;

      case 'Enter':
        if (this.activeIndex >= 0) {
          this.selectOption(this.activeIndex);
        } else {
          this.isOpen = false;
        }
        break;

      case 'Escape':
        this.isOpen = false;
        break;
    }
  }

  /** 選取指定選項，並通知父元件 */
  selectOption(index: number): void {
    this.selectedValue = this.options[index];
    this.optionSelected.emit(this.options[index]);
    this.isOpen = false;
  }

  /** 清空目前選擇，畫面恢復為 placeholder 顯示 */
  reset(): void {
    this.selectedValue = '';
    this.activeIndex = -1;
    this.isOpen = false;
  }

}
