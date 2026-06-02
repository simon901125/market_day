import { Component, Input } from '@angular/core';
import { UserHeader } from '../../user/user-header/user-header';
import { UserFooter } from '../../user/user-footer/user-footer';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-admin-layout',
  imports: [UserHeader, UserFooter, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  /** 標題 */
  @Input() title: string = '';
  /** 副標題 */
  @Input() subtitleLines: string[] = [];
}
