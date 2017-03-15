import {Component, OnInit, Renderer} from "@angular/core";
import {Router} from "@angular/router";
import {SalesDetail} from "./sales-detail";
import {Subject, Observable} from "rxjs/Rx";
import {Customer} from "../customer/customer";
import {DatePipe} from "@angular/common";
import {Product} from "../product/product";
import {SalesForPrintingService} from "../sales-for-printing/sales-for-printing.service";
import {Sales} from "./sales";
import {DialogService} from "../shared/service/dialog.service";

declare let _:any;
declare let numeral:any;
declare let $:any;

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [DatePipe, DialogService]
})
export class SalesComponent implements OnInit {
  invoiceDate:string;
  customerId:string;
  customer:string = '';
  customerAddress1:string = '';
  customerAddress2:string = '';
  customerAddress3:string = '';

  salesPaidStatus:boolean = false;

  invoiceTotal:number = 0;
  invoiceDiscount:number = 0;
  invoiceGrandTotal:number = 0;

  customers:Customer[] = [];
  products:Product[] = [];

  itemSelection:SalesDetail;

  invoiceTotalCalc:Subject<number> = new Subject<number>();
  invoiceTotalCalc$ = this.invoiceTotalCalc.asObservable();

  salesDetails:SalesDetail[] = [new SalesDetail(1, '', '', 0, 0, 0, 0)];

  smallWindow:boolean = false;

  constructor(private router:Router, private dialogService:DialogService, private datePipe:DatePipe,
              private salesForPrint:SalesForPrintingService) {
  }

  ngOnInit() {
    this.invoiceTotalCalc$.debounceTime(400).subscribe((res) => {
      let total = 0;
      for (let c of this.salesDetails) {
        total = total + ((numeral(c.productQty).value() * numeral(c.unitPrice).value()) - numeral(c.discount).value());
      }
      this.invoiceTotal = numeral(total).format('0,0');
      this.invoiceGrandTotal = numeral(total - this.invoiceDiscount).format('0,0');
    });

    $('#customerModal').modal();
    $('#productModal').modal();
    this.invoiceDate = this.datePipe.transform(new Date(), 'dd.MMM.yyyy');

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

  goToList() {
    this.router.navigate(['/']);
    return;
  }

  onAddRow(event) {
    let lastSalesDetail = _.takeRight(this.salesDetails)[0];
    if (lastSalesDetail) {
      this.salesDetails.push(new SalesDetail(Number(lastSalesDetail.id) + 1, '', '', 0, 0, 0, 0));
    } else {
      this.salesDetails.push(new SalesDetail(1, '', '', 0, 0, 0, 0));
    }

  }

  onRemoveRow(event) {
    if (this.salesDetails.length > 1) {
      if (event.allow) {
        _.remove(this.salesDetails, {'id': event.id});
      }
    }
  }

  onCreateInvoice() {
    let currentSales:Sales = new Sales();
    currentSales.salesCustomerId = this.customerId;
    currentSales.salesCustomerName = this.customer;
    currentSales.salesCustomerAddress1 = this.customerAddress1;
    currentSales.salesCustomerAddress2 = this.customerAddress2;
    currentSales.salesCustomerAddress3 = this.customerAddress3;
    currentSales.salesDate = new Date();
    for (let sd of this.salesDetails) {
      sd.productQty = numeral(sd.productQty).value();
      sd.discount = numeral(sd.discount).value();
      sd.unitPrice = numeral(sd.unitPrice).value();
      sd.salesTotal = numeral(sd.salesTotal).value();
    }
    currentSales.salesDetail = this.salesDetails;
    currentSales.salesTotal = numeral(this.invoiceTotal).value();
    currentSales.salesDiscount = numeral(this.invoiceDiscount).value();
    currentSales.salesGrandTotal = numeral(this.invoiceGrandTotal).value();
    currentSales.salesPaidStatus = this.salesPaidStatus;
    if (this.customer && this.invoiceDate) {
      this.salesForPrint.doPrint(currentSales);
      this.router.navigate(['/salesPrint']);
    } else {
      this.dialogService.showDialog('Please choose customer')
    }

  }

  calculatedPrice(salesDetail:SalesDetail):number {
    let tot:number = (numeral(salesDetail.productQty).value() * numeral(salesDetail.unitPrice).value()) - numeral(salesDetail.discount).value();
    salesDetail.salesTotal = tot;
    this.invoiceTotalCalc.next(tot);
    return numeral(tot).format('0,0');
  }

  onCustomerFilter(event) {
    this.customers = event;
    $('#customerModal').modal('open');
  }

  onProductFilter(item:SalesDetail, event) {
    this.products = event;
    this.itemSelection = item;
    $('#productModal').modal('open');
  }

  onPickCustomer(customer:Customer) {
    this.customerId = customer.id;
    this.customer = customer.customerName;
    this.customerAddress1 = customer.customerAddress1;
    this.customerAddress2 = customer.customerAddress2;
    this.customerAddress3 = customer.customerAddress3;
    $('#customerModal').modal('close');
  }

  onPickProduct(product:Product) {
    this.itemSelection.productId = product.productId;
    this.itemSelection.productName = product.productName;
    $('#productModal').modal('close');
  }

  onResetInvoice() {
    this.customer = '';
    this.customerAddress1 = '';
    this.customerAddress2 = '';
    this.customerAddress3 = '';
    this.salesDetails = [new SalesDetail(1, '', '', 0, 0, 0, 0)];
  }
}
