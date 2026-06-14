import { Component } from '@angular/core';
import { UserHeader } from '../shared/user-header/user-header';
import { UserFooter } from '../shared/user-footer/user-footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [RouterOutlet, UserHeader, UserFooter],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.scss',
})
export class UserLayout {

}
