import { TestBed, inject } from '@angular/core/testing';

import { SalesForPrintingService } from './sales-for-printing.service';

describe('SalesForPrintingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesForPrintingService]
    });
  });

  it('should ...', inject([SalesForPrintingService], (service: SalesForPrintingService) => {
    expect(service).toBeTruthy();
  }));
});
