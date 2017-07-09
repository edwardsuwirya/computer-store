import {Component, OnInit} from "@angular/core";
import {SalesTotalReportService} from "./sales-total-report.service";

@Component({
  selector: 'app-sales-total-report',
  templateUrl: './sales-total-report.component.html',
  styleUrls: ['./sales-total-report.component.css'],
  providers: [SalesTotalReportService]
})
export class SalesTotalReportComponent implements OnInit {
  pleaseWaitActive:boolean = false;
  paidSales:string;
  paidSalesCount:string;
  unpaidSales:string;
  unpaidSalesCount:string;
  cancelledSales:string;
  cancelledSalesCount:string;

  constructor(private salesTotalReportService:SalesTotalReportService) {
  }

  ngOnInit() {
    this.salesTotalReportService.getPaidSales().subscribe((res)=> {
      this.paidSales = res[0].totalSales;
    });
    this.salesTotalReportService.getPaidSalesCount().subscribe((res)=> {
      this.paidSalesCount = res;
    });
    this.salesTotalReportService.getUnpaidSales().subscribe((res)=> {
      this.unpaidSales = res[0].totalSales;
    });
    this.salesTotalReportService.getUnpaidSalesCount().subscribe((res)=> {
      this.unpaidSalesCount = res;
    });
    this.salesTotalReportService.getCancelledSales().subscribe((res)=> {
      this.cancelledSales = res[0].totalSales;
    });
    this.salesTotalReportService.getCancelledSalesCount().subscribe((res)=> {
      this.cancelledSalesCount = res;
    });

  }

}
