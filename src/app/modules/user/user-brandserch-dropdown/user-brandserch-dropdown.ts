import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-brandserch-dropdown',
  imports: [],
  templateUrl: './user-brandserch-dropdown.html',
  styleUrl: './user-brandserch-dropdown.scss',
})
export class UserBrandserchDropdown implements OnChanges {
  @Input() options: string[] = [];
  @Input() isOpen: boolean = false;
  @Output() optionSelected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  activeIndex: number = -1;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.activeIndex = -1;
    }
  }

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
        this.activeIndex = this.activeIndex <= 0 ? this.options.length - 1 : this.activeIndex - 1;
        break;
      case 'Enter':
        if (this.activeIndex >= 0) {
          this.selectOption(this.activeIndex);
        } else {
          this.closed.emit();
        }
        break;
      case 'Escape':
        this.closed.emit();
        break;
    }
  }

  selectOption(index: number): void {
    this.optionSelected.emit(this.options[index]);
    this.closed.emit();
  }
}
