import { Component } from '@angular/core';
import { OrganizerActivitySidebar } from "../organizer-activity-sidebar/organizer-activity-sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-organizer-activity-shell',
  imports: [OrganizerActivitySidebar, RouterOutlet],
  templateUrl: './organizer-activity-shell.html',
  styleUrl: './organizer-activity-shell.scss',
})
export class OrganizerActivityShell {

}
