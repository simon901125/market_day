import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss',
})
export class UserHeader {
  protected isMenuOpen = false;

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }
}
