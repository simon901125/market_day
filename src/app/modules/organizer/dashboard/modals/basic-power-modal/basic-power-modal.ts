import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventPowerPlanDraft } from '../../../../../models/interface/organizer/OrganizerEventEditor';

@Component({
  selector: 'app-basic-power-modal',
  imports: [FormsModule],
  templateUrl: './basic-power-modal.html',
  styleUrl: './basic-power-modal.scss',
})
/** 基本用電編輯視窗，收集免費供電方案的電壓、瓦數與說明。 */
export class BasicPowerModal {
  @Input({ required: true }) draft!: EventPowerPlanDraft;
  @Input() editing = false;
  @Input() closing = false;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveDialog = new EventEmitter<void>();
}
