import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar {
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
