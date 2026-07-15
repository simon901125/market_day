import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEquipmentDraft } from '../../../../../models/interface/organizer/OrganizerEventEditor';

@Component({
  selector: 'app-equipment-modal',
  imports: [FormsModule],
  templateUrl: './equipment-modal.html',
  styleUrl: './equipment-modal.scss',
})
export class EquipmentModal {
  @Input({ required: true }) draft!: EventEquipmentDraft;
  @Input() editing = false;
  @Input() closing = false;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
}
