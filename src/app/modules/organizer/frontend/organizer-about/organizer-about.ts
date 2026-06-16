import { Component } from '@angular/core';
import { UserAboutUs } from '../../../user/frontend/user-about-us/user-about-us';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { OrganizerHeader } from '../organizer-header/organizer-header';

@Component({
  selector: 'app-organizer-about',
  imports: [OrganizerHeader, UserAboutUs, UserFooter],
  templateUrl: './organizer-about.html',
})
export class OrganizerAbout {}
