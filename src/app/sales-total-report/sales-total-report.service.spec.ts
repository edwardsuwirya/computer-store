import { TestBed, inject } from '@angular/core/testing';

import { SalesTotalReportService } from './sales-total-report.service';

describe('SalesTotalReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesTotalReportService]
    });
  });

  it('should ...', inject([SalesTotalReportService], (service: SalesTotalReportService) => {
    expect(service).toBeTruthy();
  }));
});
