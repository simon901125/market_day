import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-vendor-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './vendor-sidebar.html',
  styleUrls: ['./vendor-sidebar.scss'],
})
export class VendorSidebar {
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
}
