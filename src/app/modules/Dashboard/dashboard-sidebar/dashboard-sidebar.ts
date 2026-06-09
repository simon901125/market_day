import { Component, Input } from '@angular/core';
import { MenuItem } from '../../../models/MenuItem';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
   @Input() backendTitle = '';
  @Input() menuItems: MenuItem[] = [];

  @Input() userName = '';
  @Input() userEmail = '';
  @Input() userInitial = '';
}
