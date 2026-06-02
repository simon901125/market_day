import { Component,Input } from '@angular/core';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-organizer-layout',
  imports: [RouterModule],
  templateUrl: './organizer-layout.html',
  styleUrl: './organizer-layout.scss',
})
export class OrganizerLayout {
  /** 標題 */
  @Input() title: string = '';
  /** 副標題 */
  @Input() subtitleLines: string[] = [];
}
