import {Component, OnInit, Inject} from "@angular/core";
import {SalesForPrintingService} from "./sales-for-printing.service";
import {Sales} from "../sales/sales";
import {Router} from "@angular/router";
import {APP_CONFIG} from "../shared/model/app-properties";

@Component({
  selector: 'app-sales-for-printing',
  templateUrl: './sales-for-printing.component.html',
  styleUrls: ['./sales-for-printing.component.css'],
})
export class SalesForPrintingComponent implements OnInit {
  salesPrint:Sales;
  bcaAccNo:string;
  bcaAccName:string;
  bcaBranch:string;

  constructor(@Inject(APP_CONFIG) private  appConfig, private salesForPrint:SalesForPrintingService, private router:Router) {
  }

  ngOnInit() {
    this.salesPrint = this.salesForPrint.salesForPrint;
    this.bcaAccNo = this.appConfig.bcaAccNo;
    this.bcaAccName = this.appConfig.bcaAccName;
    this.bcaBranch = this.appConfig.bcaBranch;
  }

  goToList() {
    this.router.navigate(['/home']);
    return;
  }

  doRefresh(sales:Sales) {
    this.salesPrint = sales;
  }
}
