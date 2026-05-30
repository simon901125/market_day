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
  @Input() title = '';
  @Input() highlight = '';
  @Input() description = '';
  @Input() topText = '';
  @Input() topLinkText = '';
  @Input() topLink = '';
}
