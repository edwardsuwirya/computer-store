import {Component, OnInit, Input, Output} from "@angular/core";
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
import {EventEmitter} from "@angular/forms/src/facade/async";

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
  salesPaymentUpdate:SalesPayment = new SalesPayment();

  bankNameDisabled:boolean = false;
  fieldBy:string = '';
  showFilterDate:boolean = false;
  showFilter:boolean = false;

  filterSalesBy:string = '';
  filterSales:FormControl = new FormControl('');
  keyword:string = '';
  salesDetail:SalesDetail[] = [];

  smallWindow:boolean = false;

  @Input()
  showHeader:boolean = true;

  @Input()
  title:string = 'Sales Report';

  @Output()
  modalEvent:EventEmitter<{}> = new EventEmitter();

  constructor(private router:Router, private salesPaymentService:SalesPaymentService, private salesService:SalesService, private salesForPrint:SalesForPrintingService) {
  }

  ngOnInit() {
    this.refreshSales();
    this.filterSales.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.keyword = keyword;
        this.findSales();
      }
    });
    $('#deliveryModal').modal();
    $('#comissionModal').modal();
    $('#paymentModal').modal();
    $('#salesDetailModal').modal();
    $('#deleteConfirmationModal').modal();
    let that = this;
    new Pikaday({
      field: document.getElementById('invoiceDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.keyword = this.getMoment().format('YYYY-MM-DD');
        that.findSales();
      }
    });
    new Pikaday({
      field: document.getElementById('paymentDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.salesPaymentInv.paymentDate = this.getMoment().format('DD/MM/YYYY');
      }
    });

    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(() => {
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

  findSales() {
    this.pleaseWaitActive = true;
    if (this.filterSalesBy === 'UnpaidCustomerName') {
      this.salesService.getSalesBy2Field('salesCustomerName', this.keyword, 'salesPaidStatus', '0', (this.page * 10).toString()).subscribe((sales) => {
        this.sales = _.uniqBy(_.flatten(sales), 'id');
        for (let s of this.sales) {
          this.salesPaymentService.getSalesPaymentByField('salesNo', s.salesNo, '0').subscribe((res) => {
            s.salesPayment = res;
          });
        }
        this.pleaseWaitActive = false;
      });
    } else {
      this.salesService.getSalesBy2Field(this.filterSalesBy, this.keyword, 'salesStatus', '1', (this.page * 10).toString()).subscribe((sales) => {
        this.sales = _.uniqBy(_.flatten(sales), 'id');
        for (let s of this.sales) {
          this.salesPaymentService.getSalesPaymentByField('salesNo', s.salesNo, '0').subscribe((res) => {
            s.salesPayment = res;
          });
        }
        this.pleaseWaitActive = false;
      });
    }

  }

  showSearchBar(field:string) {
    if (field === 'Date') {
      this.showFilterDate = !this.showFilterDate;
      this.showFilter = false;
    } else if (this.fieldBy === field) {
      this.showFilterDate = false;
      this.showFilter = !this.showFilter;
    } else {
      this.showFilterDate = false;
      if (!this.showFilter) {
        this.showFilter = true;
      }
    }
    this.fieldBy = field;
    if (field === 'UnpaidCustomerName') {
      this.filterSalesBy = 'UnpaidCustomerName';
    } else {
      this.filterSalesBy = 'sales' + field;
    }

    this.filterSales.setValue('');
    Observable.timer(300).do(() => {
      if (field != 'Date') {
        document.getElementById('txtFilter').focus();
      } else {
        document.getElementById('invoiceDate').focus();
      }
    }).subscribe();
  }

  viewInvoiceDetail(sales:Sales) {
    this.salesForUpdate = sales;
    this.salesDetail = sales.salesDetail;
    $('#salesDetailModal').modal('open');
  }

  refreshSales() {
    this.pleaseWaitActive = true;
    this.showFilter = false;
    this.showFilterDate = false;
    this.filterSales.setValue('');
    this.keyword = '';
    this.salesService.getAllSales((this.page * 10).toString()).subscribe((res) => {
      this.sales = res;
      for (let s of res) {
        this.salesPaymentService.getSalesPaymentByField('salesNo', s.salesNo, '0').subscribe((res) => {
          s.salesPayment = res;
        });
      }
      this.pleaseWaitActive = false;
    });
  }

  refreshPaidStatus() {
    this.salesPaymentService.getSalesPaymentByField('salesNo', this.salesForUpdate.salesNo, '0').subscribe((res) => {
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
      this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res) => {
        this.findSales();
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
    this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res) => {
      $('#deliveryModal').modal('close');
      this.pleaseWaitActive = false;
      this.modalEvent.emit({'doDeliveryCharge': '1'});
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
    this.salesService.updateSalesInfo(this.salesForUpdate).subscribe((res) => {
      $('#comissionModal').modal('close');
      this.pleaseWaitActive = false;
      this.modalEvent.emit({'doComission': '1'});
    });
  }

  onDeletePayment(salesPayment:SalesPayment, sales:Sales) {
    this.salesForUpdate = sales;
    this.salesPaymentUpdate = salesPayment;
    $('#deleteConfirmationModal').modal('open');
  }

  onConfirmDeletePayment() {
    this.salesPaymentService.deletePaymentDetail(this.salesPaymentUpdate).subscribe(() => {
      this.refreshPaidStatus();
      $('#deleteConfirmationModal').modal('close');
    });
  }

  onIgnoreDeletePayment() {
    $('#deleteConfirmationModal').modal('close');
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
    this.salesPaymentService.createPaymentDetail(this.salesPaymentInv).subscribe(() => {
      this.refreshPaidStatus();
      this.modalEvent.emit({'doPayment': '1'});
    });
  }

  onReprint(sales:Sales) {
    $('#salesDetailModal').modal('close');
    this.salesForPrint.doPrint(sales);
    this.router.navigate(['/salesPrint']);
  }

  onCancelSales(sales:Sales) {
    $('#salesDetailModal').modal('close');
    this.router.navigate(['/salesCancel/' + sales.salesNo]);
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
