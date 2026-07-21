import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEquipmentDraft } from '../../../../../models/interface/organizer/OrganizerEventEditor';

@Component({
  selector: 'app-equipment-modal',
  imports: [FormsModule],
  templateUrl: './equipment-modal.html',
  styleUrl: './equipment-modal.scss',
})
/** 設備租借編輯視窗，處理設備規格、庫存、費用與每攤限制。 */
export class EquipmentModal {
  @Input({ required: true }) draft!: EventEquipmentDraft;
  @Input() editing = false;
  @Input() closing = false;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
}
