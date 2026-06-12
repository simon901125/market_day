import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-vendor-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './vendor-header.html',
  styleUrl: './vendor-header.scss',
})
export class VendorHeader {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
