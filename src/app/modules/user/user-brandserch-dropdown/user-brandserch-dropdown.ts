import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-brandserch-dropdown',
  imports: [],
  templateUrl: './user-brandserch-dropdown.html',
  styleUrl: './user-brandserch-dropdown.scss',
})
export class UserBrandserchDropdown {
  @Input() options: string[] = [];
  @Input() placeholder: string = '';
  @Output() optionSelected = new EventEmitter<string>();

  isOpen: boolean = false;
  activeIndex: number = -1;
  selectedValue: string = '';

  constructor(private el: ElementRef) {}

  get displayLabel(): string {
    return this.selectedValue || this.placeholder;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.activeIndex = -1;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
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
          this.isOpen = false;
        }
        break;
      case 'Escape':
        this.isOpen = false;
        break;
    }
  }

  selectOption(index: number): void {
    this.selectedValue = this.options[index];
    this.optionSelected.emit(this.options[index]);
    this.isOpen = false;
  }
}
