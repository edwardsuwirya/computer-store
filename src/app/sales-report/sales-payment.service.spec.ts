import { TestBed, inject } from '@angular/core/testing';

import { SalesPaymentService } from './sales-payment.service';

describe('SalesPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesPaymentService]
    });
  });

  it('should ...', inject([SalesPaymentService], (service: SalesPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
