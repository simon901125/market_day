import { Component } from '@angular/core';
import { OrganizerHeader } from "../organizer-header/organizer-header";
import { UserFooter } from "../../user/user-footer/user-footer";

@Component({
  selector: 'app-organizer-home',
  imports: [OrganizerHeader, UserFooter],
  templateUrl: './organizer-home.html',
  styleUrl: './organizer-home.scss',
})
export class OrganizerHome {

}
