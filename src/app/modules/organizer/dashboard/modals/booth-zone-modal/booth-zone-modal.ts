import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface BoothZoneDraft {
  name: string;
  color: string;
  count: number | null;
}

@Component({
  selector: 'app-booth-zone-modal',
  imports: [FormsModule],
  templateUrl: './booth-zone-modal.html',
  styleUrl: './booth-zone-modal.scss',
})
export class BoothZoneModal {
  @Input({ required: true }) draft!: BoothZoneDraft;
  @Input() zoneColors: string[] = [];
  @Input() editing = false;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<string>();

  onColorCodeChange(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      this.colorSelected.emit('');
      return;
    }

    this.colorSelected.emit(normalized.startsWith('#') ? normalized : `#${normalized}`);
  }
}
