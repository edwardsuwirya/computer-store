import { TestBed, inject } from '@angular/core/testing';

import { PurchasePaymentService } from './purchase-payment.service';

describe('PurchasePaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasePaymentService]
    });
  });

  it('should ...', inject([PurchasePaymentService], (service: PurchasePaymentService) => {
    expect(service).toBeTruthy();
  }));
});
