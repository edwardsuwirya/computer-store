import {Component, OnInit, ViewChild} from "@angular/core";
import {OverduePaymentService} from "./overdue-payment.service";
import {Sales} from "../sales/sales";
import {Observable} from "rxjs/Rx";
import {SalesPayment} from "../sales-report/sales-payment";
import {SalesDetail} from "../sales/sales-detail";
import {Router} from "@angular/router";
import {SalesReportComponent} from "../sales-report/sales-report.component";

declare let numeral:any;
declare let $:any;

@Component({
  selector: 'app-overdue-report',
  templateUrl: './overdue-report.component.html',
  styleUrls: ['./overdue-report.component.css'],
  providers: [OverduePaymentService]
})
export class OverdueReportComponent implements OnInit {
  @ViewChild('salesReport')
  salesReport:SalesReportComponent;

  hidePayment:boolean = true;

  pleaseWaitActive:boolean = false;
  overdues:Sales[] = [];
  smallWindow:boolean = false;
  salesForUpdate:Sales = new Sales();
  salesDetail:SalesDetail[] = [];

  constructor(private router:Router, private overduePaymentService:OverduePaymentService) {
  }

  ngOnInit() {
    this.refreshSales();

    Observable.fromEvent(window, 'resize').subscribe(() => {
      this.checkSmallWindow();
    })
    $('#salesDetailModal').modal();
  }

  checkSmallWindow() {
    if (window.screen.height < 700) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  viewInvoiceDetail(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesDetail = sales.salesDetail;
    $('#salesDetailModal').modal('open');
  }

  salesPaymentTotalCalculation(salesPayment:SalesPayment[]):number {
    if (salesPayment) {
      let totalPayment:number = 0;
      for (let ssp of salesPayment) {
        totalPayment = totalPayment + numeral(ssp.paymentValue).value();
      }
      return totalPayment;
    } else {
      return 0;
    }
  }

  onSalesReportModal(event) {
  }

  onClosePaymentPanel() {
    this.hidePayment = true;
  }

  makePayment(sales:Sales) {
    this.salesReport.filterSalesBy = 'salesNo';
    this.salesReport.keyword = sales.salesNo;
    this.salesReport.findSales();
    this.hidePayment = false;
    window.scroll(0, 0);

  }

  onCancelSales(sales:Sales) {
    $('#salesDetailModal').modal('close');
    this.router.navigate(['/salesCancel/' + sales.salesNo]);
  }

  refreshSales() {
    this.pleaseWaitActive = true;
    this.overduePaymentService.getAllOverdue().subscribe((res)=> {
      this.overdues = res;
      this.pleaseWaitActive = false
    })
    this.checkSmallWindow();
  }
}
