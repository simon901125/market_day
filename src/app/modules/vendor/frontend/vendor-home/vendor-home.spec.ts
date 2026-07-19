import { of } from 'rxjs';
import { Router } from '@angular/router';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { VendorHome } from './vendor-home';

describe('VendorHome', () => {
  it('loads only activities that the backend considers currently registerable', () => {
    const vendorService = jasmine.createSpyObj<VendorService>('VendorService', ['searchMarkets']);
    vendorService.searchMarkets.and.returnValue(
      of({
        statusCode: 200,
        message: 'ok',
        messageDetails: null,
        data: {
          markets: {
            items: [],
            page: 1,
            pageSize: 3,
            totalItems: 0,
            totalPages: 0,
            hasPrevious: false,
            hasNext: false,
          },
        },
      }),
    );
    const component = new VendorHome({} as Router, vendorService);

    component.ngOnInit();

    expect(vendorService.searchMarkets).toHaveBeenCalledTimes(1);
    expect(vendorService.searchMarkets).toHaveBeenCalledWith(
      jasmine.objectContaining({ page: 1, pageSize: 3 }),
    );
    const criteria = vendorService.searchMarkets.calls.mostRecent().args[0];
    expect(criteria?.status).toBeUndefined();
  });
});
