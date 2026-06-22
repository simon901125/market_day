import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoothZoneDraft } from '../../../../../models/interface/organizer/BoothZoneDraft';

@Component({
  selector: 'app-booth-zone-modal',
  imports: [FormsModule],
  templateUrl: './booth-zone-modal.html',
  styleUrl: './booth-zone-modal.scss',
})
export class BoothZoneModal {
  @Input({ required: true }) draft!: BoothZoneDraft;
  @Input() zoneColors: string[] = [];
  @Input() existingZoneNames: string[] = [];
  @Input() existingZoneColors: string[] = [];
  @Input() editing = false;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
  @Output() colorSelected = new EventEmitter<string>();

  submitted = false;

  get nameInvalid(): boolean {
    return !this.draft.name.trim();
  }

  get nameDuplicate(): boolean {
    const currentName = this.normalizeZoneName(this.draft.name);
    return Boolean(currentName) && this.existingZoneNames.some((name) => this.normalizeZoneName(name) === currentName);
  }

  get colorRequired(): boolean {
    return !this.draft.color.trim();
  }

  get colorFormatInvalid(): boolean {
    return !this.colorRequired && !/^#[0-9A-Fa-f]{6}$/.test(this.draft.color.trim());
  }

  get colorDuplicate(): boolean {
    const currentColor = this.draft.color.trim().toUpperCase();
    return (
      !this.colorRequired &&
      !this.colorFormatInvalid &&
      this.existingZoneColors.some((color) => color.trim().toUpperCase() === currentColor)
    );
  }

  get countInvalid(): boolean {
    const count = Number(this.draft.count);
    return this.draft.count === null || !Number.isInteger(count) || count < 1;
  }

  get formInvalid(): boolean {
    return (
      this.nameInvalid ||
      this.nameDuplicate ||
      this.colorRequired ||
      this.colorFormatInvalid ||
      this.colorDuplicate ||
      this.countInvalid
    );
  }

  onColorCodeChange(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      this.colorSelected.emit('');
      return;
    }

    this.colorSelected.emit(normalized.startsWith('#') ? normalized : `#${normalized}`);
  }

  onSave(): void {
    this.submitted = true;
    if (this.formInvalid) {
      return;
    }

    this.saveDialog.emit();
  }

  private normalizeZoneName(name: string): string {
    return name.trim().replace(/\s*區$/, '').trim().toLocaleLowerCase();
  }
}
