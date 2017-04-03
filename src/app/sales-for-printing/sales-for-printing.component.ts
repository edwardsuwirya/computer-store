import {Component, OnInit} from '@angular/core';
import {SalesForPrintingService} from "./sales-for-printing.service";
import {Sales} from "../sales/sales";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sales-for-printing',
  templateUrl: './sales-for-printing.component.html',
  styleUrls: ['./sales-for-printing.component.css'],
})
export class SalesForPrintingComponent implements OnInit {
  salesPrint: Sales;

  constructor(private salesForPrint: SalesForPrintingService, private router: Router) {
  }

  ngOnInit() {
    this.salesPrint = this.salesForPrint.salesForPrint;
  }

  goToList() {
    this.router.navigate(['/home']);
    return;
  }

  doRefresh(sales: Sales) {
    this.salesPrint = sales;
  }
}
