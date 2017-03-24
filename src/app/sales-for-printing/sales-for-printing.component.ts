import {Component, OnInit} from '@angular/core';
import {SalesForPrintingService} from "./sales-for-printing.service";
import {Sales} from "../sales/sales";

@Component({
  selector: 'app-sales-for-printing',
  templateUrl: './sales-for-printing.component.html',
  styleUrls: ['./sales-for-printing.component.css'],
})
export class SalesForPrintingComponent implements OnInit {
  salesPrint:Sales;

  constructor(private salesForPrint:SalesForPrintingService) {
  }

  ngOnInit() {
    this.salesPrint = this.salesForPrint.salesForPrint;
  }

  doRefresh(sales:Sales) {
    this.salesPrint = sales;
  }
}
