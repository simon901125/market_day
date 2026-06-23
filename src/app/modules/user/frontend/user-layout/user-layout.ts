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
/** 一般使用者前台的外層版型，統一放置 Header、Footer 與子路由內容。 */
export class UserLayout {

}
