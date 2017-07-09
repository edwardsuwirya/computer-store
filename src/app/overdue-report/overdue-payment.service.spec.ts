import { TestBed, inject } from '@angular/core/testing';

import { OverduePaymentService } from './overdue-payment.service';

describe('OverduePaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OverduePaymentService]
    });
  });

  it('should ...', inject([OverduePaymentService], (service: OverduePaymentService) => {
    expect(service).toBeTruthy();
  }));
});
