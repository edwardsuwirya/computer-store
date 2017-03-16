import {Component, OnInit, Renderer} from "@angular/core";
import {Router} from "@angular/router";
import {SalesDetail} from "./sales-detail";
import {Subject, Observable} from "rxjs/Rx";
import {Customer} from "../customer/customer";
import {Product} from "../product/product";
import {SalesForPrintingService} from "../sales-for-printing/sales-for-printing.service";
import {Sales} from "./sales";
import {DialogService} from "../shared/service/dialog.service";
import {FormControl} from "@angular/forms";
import {CustomerService} from "../customer/customer.service";
import {ProductService} from "../product/product.service";

declare let _: any;
declare let numeral: any;
declare let $: any;
declare let moment: any;
declare let Pikaday: any;
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [DialogService, CustomerService, ProductService]
})
export class SalesComponent implements OnInit {
  invoiceNo: string;
  invoiceDate: string;
  customerId: string;
  customer: string = '';
  customerAddress1: string = '';
  customerAddress2: string = '';
  customerAddress3: string = '';

  salesPaidStatus: boolean = false;

  invoiceTotal: number = 0;
  invoiceDiscount: number = 0;
  invoiceGrandTotal: number = 0;

  customers: Customer[] = [];
  products: Product[] = [];

  itemSelection: SalesDetail;

  invoiceTotalCalc: Subject<number> = new Subject<number>();
  invoiceTotalCalc$ = this.invoiceTotalCalc.asObservable();

  salesDetails: SalesDetail[] = [new SalesDetail(1, '', '', 0, 0, 0, 0, '')];

  smallWindow: boolean = false;

  customerFilterForm: FormControl = new FormControl();
  productFilterForm: FormControl = new FormControl();

  constructor(private router: Router, private dialogService: DialogService,
              private salesForPrint: SalesForPrintingService, private customerService: CustomerService,
              private productService: ProductService) {
    setTimeout(function () {
      document.getElementById('customer').focus();
    }, 200);
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

    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(() => {
      this.checkSmallWindow();
    });

    this.customerFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        let multiCustomerResult = [];
        Observable.forkJoin(
          this.customerService.getCustomerByField('customerName', keyword),
          this.customerService.getCustomerByField('customerNickName', keyword)
        ).subscribe((res) => {
          this.customers = _.uniqBy(_.flatten(res), 'id');
        })
      }
    });
    this.productFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.productService.getProductByField('productName', keyword).subscribe((prod) => {
          this.products = prod;
        })
      }
    });
    let that = this;
    new Pikaday({
      field: document.getElementById('invoiceDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.invoiceDate = this.getMoment().format('DD/MM/YYYY');
      }
    });
    this.invoiceDate = moment().format('DD/MM/YYYY');
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
      let currId = Number(lastSalesDetail.id) + 1;
      this.salesDetails.push(new SalesDetail(currId, '', '', 0, 0, 0, 0, ''));
      setTimeout(function () {
        document.getElementById(currId.toString()).focus();
      }, 300);

    } else {
      this.salesDetails.push(new SalesDetail(1, '', '', 0, 0, 0, 0, ''));
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
    let currentSales: Sales = new Sales();
    currentSales.salesNo = this.invoiceNo;
    currentSales.salesCustomerId = this.customerId;
    currentSales.salesCustomerName = this.customer;
    currentSales.salesCustomerAddress1 = this.customerAddress1;
    currentSales.salesCustomerAddress2 = this.customerAddress2;
    currentSales.salesCustomerAddress3 = this.customerAddress3;
    console.log(this.invoiceDate);
    currentSales.salesDate = moment(this.invoiceDate, 'DD/MM/YYYY');
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
    if (this.customer && this.invoiceDate && this.invoiceNo) {
      this.salesForPrint.doPrint(currentSales);
      this.router.navigate(['/salesPrint']);
    } else {
      this.dialogService.showDialog('Please choose customer')
    }
  }

  calculatedPrice(salesDetail: SalesDetail): number {
    let tot: number = (numeral(salesDetail.productQty).value() * numeral(salesDetail.unitPrice).value()) - numeral(salesDetail.discount).value();
    salesDetail.salesTotal = tot;
    this.invoiceTotalCalc.next(tot);
    return numeral(tot).format('0,0');
  }

  onCustomerFilter(event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      $('#customerModal').modal('open');
      setTimeout(function () {
        document.getElementById('customerFilter').focus();
      }, 300);
    }
  }

  onProductFilter(item: SalesDetail, event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      this.itemSelection = item;
      $('#productModal').modal('open');
      setTimeout(function () {
        document.getElementById('productFilter').focus();
      }, 300);
    }
  }

  onPickCustomer(customer: Customer) {
    this.customerId = customer.id;
    this.customer = customer.customerName;
    this.customerAddress1 = customer.customerAddress1;
    this.customerAddress2 = customer.customerAddress2;
    this.customerAddress3 = customer.customerAddress3;
    $('#customerModal').modal('close');
    setTimeout(function () {
      document.getElementById('invoiceNo').focus();
    }, 300);
  }

  onPickProduct(product: Product) {
    this.itemSelection.productId = product.productId;
    this.itemSelection.productName = product.productName;
    $('#productModal').modal('close');
    let that = this;
    setTimeout(function () {
      document.getElementById('item' + that.itemSelection.id).focus();
    }, 300);
  }

  onResetInvoice() {
    this.invoiceNo = '';
    this.customer = '';
    this.customerAddress1 = '';
    this.customerAddress2 = '';
    this.customerAddress3 = '';
    this.salesDetails = [new SalesDetail(1, '', '', 0, 0, 0, 0, '')];
    this.invoiceDate = moment().format('DD/MM/YYYY');
  }
}
