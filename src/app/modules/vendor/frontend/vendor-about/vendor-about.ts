import { Component } from '@angular/core';
import { UserAboutUs } from '../../../user/frontend/user-about-us/user-about-us';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

@Component({
  selector: 'app-vendor-about',
  imports: [VendorHeader, UserAboutUs, UserFooter],
  templateUrl: './vendor-about.html',
})
export class VendorAbout {}
