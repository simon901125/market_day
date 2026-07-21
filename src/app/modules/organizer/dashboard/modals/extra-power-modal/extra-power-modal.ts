import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventPowerPlanDraft } from '../../../../../models/interface/organizer/OrganizerEventEditor';

@Component({
  selector: 'app-extra-power-modal',
  imports: [FormsModule],
  templateUrl: './extra-power-modal.html',
  styleUrl: './extra-power-modal.scss',
})
/** 額外用電編輯視窗，收集加購用電方案與每日費用。 */
export class ExtraPowerModal {
  @Input({ required: true }) draft!: EventPowerPlanDraft;
  @Input() editing = false;
  @Input() closing = false;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
}
