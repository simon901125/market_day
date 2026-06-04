import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-organizer-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './organizer-header.html',
  styleUrl: './organizer-header.scss',
})
export class OrganizerHeader {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
