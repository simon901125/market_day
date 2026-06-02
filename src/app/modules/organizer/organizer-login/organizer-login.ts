import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { OrganizerSidebar } from '../organizer-sidebar/organizer-sidebar'

@Component({
  selector: 'app-organizer-login',
  imports: [RouterModule, CommonModule, FormsModule, OrganizerSidebar],
  templateUrl: './organizer-login.html',
  styleUrl: './organizer-login.scss',
})
export class OrganizerLogin {
  email = '';
  password = '';
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginAdmin() {
    console.log('admin login', this.email, this.password);
  }
}
