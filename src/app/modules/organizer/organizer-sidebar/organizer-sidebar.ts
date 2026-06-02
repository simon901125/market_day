import { Component,Input } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms"; 

@Component({
  selector: 'app-organizer-sidebar',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './organizer-sidebar.html',
  styleUrl: './organizer-sidebar.scss',
})
export class OrganizerSidebar {
  /** 標題 */
  @Input() title = '';
  /** 突出顯示 */
  @Input() highlight = '';
  /** 描述 */
  @Input() description = '';
  /** 上方文字 */
  @Input() topText = '';
  /** 上方連結文字 */
  @Input() topLinkText = '';
  /** 上方連結 */
  @Input() topLink = '';
  @Input() systemName = '攤主後台';
}
