import { Component } from '@angular/core';
import { VendorHeader } from "../vendor-header/vendor-header";
import { UserFooter } from "../../../user/frontend/user-footer/user-footer";

@Component({
  selector: 'app-vendor-market-signup-detail',
  imports: [VendorHeader, UserFooter],
  templateUrl: './vendor-market-signup-detail.html',
  styleUrl: './vendor-market-signup-detail.scss',
})
export class VendorMarketSignupDetail {

}
