import {Injectable} from '@angular/core';
import {Sales} from "../sales/sales";

@Injectable()
export class SalesForPrintingService {
  salesForPrint: Sales;

  constructor() {
  }

  doPrint(sales: Sales) {
    this.salesForPrint = sales;
  }
}
