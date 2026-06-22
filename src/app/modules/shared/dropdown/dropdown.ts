import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  @Input() title = '';
  @Input() options: string[] = [];
  @Input() placeholder = '';
  @Input() iconClass = '';
  @Input() selectedValue = '';

  @Output() optionSelected = new EventEmitter<string>();

  isOpen = false;
  activeIndex = -1;

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
    if (!this.isOpen || this.options.length === 0) return;

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

  selectOption(index: number): void {
    this.selectedValue = this.options[index];
    this.optionSelected.emit(this.options[index]);
    this.isOpen = false;
  }

  reset(): void {
    this.selectedValue = '';
    this.activeIndex = -1;
    this.isOpen = false;
  }
}
