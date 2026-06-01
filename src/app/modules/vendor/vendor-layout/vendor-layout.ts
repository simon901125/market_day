import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-vendor-layout',
  imports: [RouterModule],
  templateUrl: './vendor-layout.html',
  styleUrl: './vendor-layout.scss',
})
export class VendorLayout {
  /** 標題 */
  @Input() title: string = '';
  /** 副標題 */
  @Input() subtitleLines: string[] = [];
}
