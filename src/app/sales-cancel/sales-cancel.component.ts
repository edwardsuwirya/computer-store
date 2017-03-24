import {Component, OnInit, ViewChild} from '@angular/core';
import {SalesForPrintingService} from "../sales-for-printing/sales-for-printing.service";
import {SalesService} from "../sales/sales.service";
import {SalesForPrintingComponent} from "../sales-for-printing/sales-for-printing.component";
import {Sales} from "../sales/sales";

@Component({
  selector: 'app-sales-cancel',
  templateUrl: './sales-cancel.component.html',
  styleUrls: ['./sales-cancel.component.css'],
  providers: [SalesService]
})
export class SalesCancelComponent implements OnInit {
  @ViewChild('info')
  salesInfo:SalesForPrintingComponent;
  salesNo:string;
  salesForCancel:Sales;

  constructor(private salesService:SalesService, private salesForPrint:SalesForPrintingService) {
  }

  ngOnInit() {
  }

  onFindSales() {
    this.salesService.getSalesByField('salesNo', this.salesNo).subscribe((res)=> {
      this.salesForCancel = res[0];
      this.salesInfo.doRefresh(this.salesForCancel);

    })
  }

  onCancelSales() {
    this.salesForCancel.salesStatus = '0'
    this.salesService.saveSales(this.salesForCancel).subscribe((res)=> {
    })
  }
}
