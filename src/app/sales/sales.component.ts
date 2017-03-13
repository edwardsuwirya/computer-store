import {Component, OnInit, Renderer} from "@angular/core";
import {Router} from "@angular/router";
import {SalesDetail} from "./sales-detail";
import {Subject} from "rxjs/Rx";
import {Customer} from "../customer/customer";
import {DatePipe} from "@angular/common";
import {Product} from "../product/product";

declare let _:any;
declare let numeral:any;
declare let $:any;

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [DatePipe]
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

  salesDetails:SalesDetail[] = [new SalesDetail(1, '', 0, 0, 0)];

  constructor(private router:Router, private rd:Renderer, private datePipe:DatePipe) {
  }

  ngOnInit() {
    this.invoiceTotalCalc$.debounceTime(400).subscribe((res)=> {
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
  }


  goToList() {
    this.router.navigate(['/']);
    return;
  }

  onAddRow(event) {
    this.salesDetails.push(new SalesDetail(this.salesDetails.length + 1, '', 0, 0, 0));
  }

  onRemoveRow(event) {
    if (this.salesDetails.length > 1) {
      if (event.allow) {
        _.remove(this.salesDetails, {'id': event.id});
      }
    }
  }

  onCreateInvoice() {
    this.router.navigate(['/salesPrint']);
  }

  calculatedPrice(salesDetail):number {
    let tot:number = (numeral(salesDetail.productQty).value() * numeral(salesDetail.unitPrice).value()) - numeral(salesDetail.discount).value();
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
    this.customer = customer.customerName;
    this.customerAddress1 = customer.customerAddress1;
    this.customerAddress2 = customer.customerAddress2;
    this.customerAddress3 = customer.customerAddress3;
    $('#customerModal').modal('close');
  }

  onPickProduct(product:Product) {
    this.itemSelection.productName = product.productName;
    $('#productModal').modal('close');
  }

  onResetInvoice() {
    this.customer = '';
    this.customerAddress1 = '';
    this.customerAddress2 = '';
    this.customerAddress3 = '';
    this.salesDetails = [new SalesDetail(1, '', 0, 0, 0)];
  }
}
