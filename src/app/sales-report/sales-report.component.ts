import {Component, OnInit} from "@angular/core";
import {SalesPayment} from "./sales-payment";
import {SalesPaymentService} from "./sales-payment.service";
import {SalesService} from "../sales/sales.service";
import {Sales} from "../sales/sales";
import {PricePipe} from "../shared/pipe/price.pipe";
import {FormControl} from "@angular/forms";
import {SalesDetail} from "../sales/sales-detail";
import {Observable} from "rxjs/Rx";
import {SalesForPrintingService} from "../sales-for-printing/sales-for-printing.service";
import {Router} from "@angular/router";

declare let _:any;
declare let $:any;
declare let numeral:any;
declare let moment:any;
declare let Pikaday:any;

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css'],
  providers: [SalesPaymentService, SalesService, PricePipe]
})
export class SalesReportComponent implements OnInit {
  page:number = 0;
  pleaseWaitActive:boolean = false;

  sales:Sales[] = [];
  salesPaymentInv:SalesPayment = new SalesPayment();
  salesForUpdate:Sales = new Sales();

  bankNameDisabled:boolean = false;
  fieldBy:string = '';
  showFilter:boolean = false;
  filterSalesBy:string = '';
  filterSales:FormControl = new FormControl('');
  keyword:string = '';
  salesDetail:SalesDetail[] = [];

  smallWindow:boolean = false;

  constructor(private router:Router, private salesPaymentService:SalesPaymentService, private salesService:SalesService, private salesForPrint:SalesForPrintingService) {
  }

  ngOnInit() {
    this.refreshSales();
    this.filterSales.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      if (keyword) {
        this.keyword = keyword;
        this.findSales();
      }
    });
    $('#deliveryModal').modal();
    $('#comissionModal').modal();
    $('#paymentModal').modal();
    $('#salesDetailModal').modal();
    let that = this;
    new Pikaday({
      field: document.getElementById('paymentDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.salesPaymentInv.paymentDate = this.getMoment().format('DD/MM/YYYY');
      }
    });
    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(()=> {
      this.checkSmallWindow();
    })
  }

  checkSmallWindow() {
    if (window.screen.height < 700) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  private findSales() {
    this.pleaseWaitActive = true;
    this.salesService.getSalesBy2Field(this.filterSalesBy, this.keyword, 'salesStatus', '1', (this.page * 10).toString()).subscribe((sales)=> {
      this.sales = _.uniqBy(_.flatten(sales), 'id');
      for (let s of this.sales) {
        this.salesPaymentService.getSalesPaymentByField('salesNo', s.salesNo, '0').subscribe((res)=> {
          s.salesPayment = res;
        });
      }
      this.pleaseWaitActive = false;
    });
  }

  showSearchBar(field:string) {
    if (this.fieldBy === field) {
      this.showFilter = !this.showFilter;
    } else {
      if (!this.showFilter) {
        this.showFilter = true;
      }
    }
    this.fieldBy = field;
    this.filterSalesBy = 'sales' + field;
    this.filterSales.setValue('');
    setTimeout(function () {
      document.getElementById('txtFilter').focus();
    }, 200);
  }

  viewInvoiceDetail(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesDetail = sales.salesDetail;
    $('#salesDetailModal').modal('open');
  }

  refreshSales() {
    this.pleaseWaitActive = true;
    this.salesService.getAllSales((this.page * 10).toString()).subscribe((res)=> {
      this.sales = res;
      for (let s of res) {
        this.salesPaymentService.getSalesPaymentByField('salesNo', s.salesNo, '0').subscribe((res)=> {
          s.salesPayment = res;
        });
      }
      this.pleaseWaitActive = false;
    });
  }

  refreshPaidStatus() {
    this.salesPaymentService.getSalesPaymentByField('salesNo', this.salesForUpdate.salesNo, '0').subscribe((res)=> {
      let grandTotal = this.salesForUpdate.salesTotal - this.salesForUpdate.salesDiscount;
      let totalPayment:number = 0;
      for (let r of res) {
        totalPayment = totalPayment + r.paymentValue;
      }
      let nominalAccured:number = grandTotal - totalPayment;
      if (nominalAccured > 0) {
        this.salesForUpdate.salesPaidStatus = '0';
      } else {
        this.salesForUpdate.salesPaidStatus = '1';
      }
      this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res)=> {
        this.refreshSales();
        $('#paymentModal').modal('close');
        this.pleaseWaitActive = false;
      });
    });
  }

  onUpdateDeliveryCharge(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesForUpdate.salesDeliveryCharge = new PricePipe().transform(this.salesForUpdate.salesDeliveryCharge);
    $('#deliveryModal').modal('open');
  }

  onDoDeliveryCharge() {
    this.pleaseWaitActive = true;
    this.salesForUpdate.salesDeliveryCharge = numeral(this.salesForUpdate.salesDeliveryCharge).value();
    this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res)=> {
      $('#deliveryModal').modal('close');
      this.pleaseWaitActive = false;
    });
  }

  onUpdateComission(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesForUpdate.salesComission = new PricePipe().transform(this.salesForUpdate.salesComission);
    $('#comissionModal').modal('open');
  }

  onDoComission() {
    this.pleaseWaitActive = true;
    this.salesForUpdate.salesComission = numeral(this.salesForUpdate.salesComission).value();
    this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res)=> {
      $('#comissionModal').modal('close');
      this.pleaseWaitActive = false;
    });
  }

  onDeletePayment(salesPayment:SalesPayment, sales:Sales) {
    this.salesForUpdate = sales;
    this.salesPaymentService.deletePaymentDetail(salesPayment).subscribe(()=> {
      this.refreshPaidStatus();
    });
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

  onUpdatePaymentMethod(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesPaymentInv = new SalesPayment();
    $('#paymentModal').modal('open');
  }

  onDoPayment() {
    this.pleaseWaitActive = true;
    this.salesPaymentInv.paymentValue = numeral(this.salesPaymentInv.paymentValue).value();
    this.salesPaymentInv.paymentDate = moment(this.salesPaymentInv.paymentDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.salesPaymentInv.salesNo = this.salesForUpdate.salesNo;
    this.salesPaymentService.createPaymentDetail(this.salesPaymentInv).subscribe(()=> {
      this.refreshPaidStatus();
    });
  }

  onReprint(sales:Sales) {
    $('#salesDetailModal').modal('close');
    this.salesForPrint.doPrint(sales);
    this.router.navigate(['/salesPrint']);
  }

  prev() {
    if (this.page > 0) {
      this.page = this.page - 1;
      if (this.keyword) {
        this.findSales();
      } else {
        this.refreshSales();
      }
    } else {
    }
  }

  next() {
    this.page = this.page + 1;
    if (this.keyword) {
      this.findSales();
    } else {
      this.refreshSales();
    }
  }
}
