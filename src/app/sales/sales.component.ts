import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {SalesDetail} from "./sales-detail";
import {Subject, Observable, BehaviorSubject} from "rxjs/Rx";
import {Customer} from "../customer/customer";
import {Product} from "../product/product";
import {SalesForPrintingService} from "../sales-for-printing/sales-for-printing.service";
import {Sales} from "./sales";
import {DialogService} from "../shared/service/dialog.service";
import {FormControl} from "@angular/forms";
import {CustomerService} from "../customer/customer.service";
import {ProductService} from "../product/product.service";
import {SalesService} from "./sales.service";

declare let _: any;
declare let numeral: any;
declare let $: any;
declare let moment: any;
declare let Pikaday: any;
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [DialogService, CustomerService, ProductService, SalesService]
})
export class SalesComponent implements OnInit {
  pleaseWaitActive: boolean = false;
  invoiceNo: string;
  invoiceDate: string;
  purchaseOrderNo:string;
  customerId: string;
  customer: string = '';
  customerAddress1: string = '';
  customerAddress2: string = '';
  customerAddress3: string = '';

  invoiceTotal: number = 0;
  invoiceDiscount: number = 0;
  invoiceGrandTotal: number = 0;

  customers: Customer[] = [];
  products: Product[] = [];

  itemSelection: SalesDetail;

  invoiceTotalCalc: Subject<number> = new Subject<number>();
  customerRegistrationComplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  productRegistrationComplete: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  invoiceTotalCalc$ = this.invoiceTotalCalc.asObservable();
  customerRegistrationComplete$ = this.customerRegistrationComplete.asObservable();
  productRegistrationComplete$ = this.productRegistrationComplete.asObservable();

  salesDetails: SalesDetail[] = [new SalesDetail(1, '', '', 0, 0, 0, 0, '')];


  smallWindow: boolean = false;

  customerFilterForm: FormControl = new FormControl();
  productFilterForm: FormControl = new FormControl();

  constructor(private router: Router, private dialogService: DialogService,
              private salesForPrint: SalesForPrintingService, private customerService: CustomerService,
              private productService: ProductService, private salesService: SalesService) {
    Observable.timer(200).do(() => {
      document.getElementById('customer').focus();
    }).subscribe();
  }

  ngOnInit() {
    this.salesService.getRunningNumberSales(moment().format('YYMM')).subscribe((res) => {
      this.invoiceNo = res;
    })
    this.invoiceTotalCalc$.debounceTime(300).subscribe((res) => {
      let total = 0;
      for (let c of this.salesDetails) {
        total = total + ((numeral(c.productQty).value() * numeral(c.unitPrice).value()) - numeral(c.discount).value());
      }
      this.invoiceTotal = numeral(total).format('0,0');
      this.invoiceGrandTotal = numeral(total - numeral(this.invoiceDiscount).value()).format('0,0');
    });

    $('#customerModal').modal();
    $('#productModal').modal();

    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(() => {
      this.checkSmallWindow();
    });

    this.customerFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        Observable.forkJoin(
          this.customerService.getCustomerByField('customerName', keyword, '0'),
          this.customerService.getCustomerByField('customerNickName', keyword, '0')
        ).subscribe((res) => {
          this.customers = _.uniqBy(_.flatten(res), 'id');
        })
      }
    });
    this.productFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.productService.getProductBy2Fields('productName', keyword, 'productStatus', '1', '0').subscribe((prod) => {
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
    this.router.navigate(['/home']);
    return;
  }

  onAddRow(event) {
    let lastSalesDetail = _.takeRight(this.salesDetails)[0];
    if (lastSalesDetail) {
      let currId = Number(lastSalesDetail.id) + 1;
      this.salesDetails.push(new SalesDetail(currId, '', '', 0, 0, 0, 0, ''));
      Observable.timer(300).do(() => {
        document.getElementById(currId.toString()).focus();
      }).subscribe();
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
    if (this.customer && this.invoiceDate && this.invoiceNo) {
      if (numeral(this.invoiceGrandTotal).value() > 0) {
        this.pleaseWaitActive = true;
        let currentSales: Sales = new Sales();
        currentSales.salesNo = this.invoiceNo;
        currentSales.purchaseOrderNo = this.purchaseOrderNo;
        currentSales.salesDate = moment(this.invoiceDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (this.customerId) {
          currentSales.salesCustomerId = this.customerId;
          currentSales.salesCustomerName = this.customer;
          currentSales.salesCustomerAddress1 = this.customerAddress1;
          currentSales.salesCustomerAddress2 = this.customerAddress2;
          currentSales.salesCustomerAddress3 = this.customerAddress3;
          this.customerRegistrationComplete.next(true);
        } else {
          let newCust: Customer = new Customer();
          newCust.customerName = this.customer;
          newCust.customerAddress1 = this.customerAddress1;
          newCust.customerAddress2 = this.customerAddress2;
          newCust.customerAddress3 = this.customerAddress3;
          newCust.customerStatus = '1';
          this.customerService.saveCustomer(newCust).subscribe((res) => {
            currentSales.salesCustomerId = res.id;
            currentSales.salesCustomerName = this.customer;
            currentSales.salesCustomerAddress1 = this.customerAddress1;
            currentSales.salesCustomerAddress2 = this.customerAddress2;
            currentSales.salesCustomerAddress3 = this.customerAddress3;
            this.customerRegistrationComplete.next(true);
          }, (err) => {
            this.dialogService.showDialog('Some error occurred ' + err);
          });
        }

        let unregisterProduct: SalesDetail[] = [];
        for (let sd of this.salesDetails) {
          let isUnregister: boolean = false;
          if (!sd.productId) {
            isUnregister = true;
          }
          sd.productQty = numeral(sd.productQty).value();
          sd.discount = numeral(sd.discount).value();
          sd.unitPrice = numeral(sd.unitPrice).value();
          sd.salesTotal = numeral(sd.salesTotal).value();
          if (isUnregister) {
            unregisterProduct.push(sd);
          }
        }

        if (unregisterProduct.length > 0) {
          Observable.of(...unregisterProduct).map((sdProd) => {
            let newProd: Product = new Product();
            newProd.productName = sdProd.productName;
            newProd.productStatus = '1';
            newProd.productStock = -1 * (sdProd.productQty);
            Observable.create((obs) => {
              this.productService.saveProduct(newProd).subscribe((res) => {
                sdProd.productId = res.id;
                obs.next();
              }, (err) => {
                this.dialogService.showDialog('Some error occurred ' + err);
              });
            }).subscribe();
          }).subscribe(() => {
          }, (err) => {
            this.dialogService.showDialog('Some error occurred ' + err);
          }, () => {
            this.productRegistrationComplete.next(true);
          });
        } else {
          this.productRegistrationComplete.next(true);
        }

        currentSales.salesDetail = this.salesDetails;

        currentSales.salesTotal = numeral(this.invoiceTotal).value();
        currentSales.salesDiscount = numeral(this.invoiceDiscount).value();
        currentSales.salesGrandTotal = numeral(this.invoiceGrandTotal).value();
        currentSales.salesPaidStatus = '0';
        currentSales.salesStatus = '1';

        this.customerRegistrationComplete$.subscribe((res) => {
          if (res) {
            this.productRegistrationComplete$.subscribe((res) => {
              if (res) {
                this.salesService.saveSales(currentSales).subscribe((res) => {
                  this.salesForPrint.doPrint(currentSales);
                  this.router.navigate(['/salesPrint']);
                  this.pleaseWaitActive = false;
                }, (err) => {
                  this.dialogService.showDialog('Some error occurred ' + err);
                });
              }
            })
          }
        })
      } else {
        this.dialogService.showDialog('Your invoice grand total is zero/minus');
      }
    } else {
      this.dialogService.showDialog('Please fill customer & invoice info');
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
      Observable.timer(300).do(() => {
        document.getElementById('customerFilter').focus();
      }).subscribe();
    }
  }

  onProductFilter(item: SalesDetail, event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      this.productFilterForm.setValue('');
      this.products = [];
      this.itemSelection = item;
      $('#productModal').modal('open');
      Observable.timer(300).do(() => {
        document.getElementById('productFilter').focus();
      }).subscribe();
    }
  }

  onPickCustomer(customer: Customer) {
    this.customerId = customer.id;
    this.customer = customer.customerName;
    this.customerAddress1 = customer.customerAddress1;
    this.customerAddress2 = customer.customerAddress2;
    this.customerAddress3 = customer.customerAddress3;
    $('#customerModal').modal('close');
    Observable.timer(300).do(() => {
      document.getElementById('invoiceNo').focus();
    }).subscribe();
  }

  onPickProduct(product: Product) {
    this.itemSelection.productId = product.id;
    this.itemSelection.productName = product.productName;
    $('#productModal').modal('close');
    let that = this;
    Observable.timer(300).do(() => {
      document.getElementById('item' + that.itemSelection.id).focus();
    }).subscribe();
  }

  onResetInvoice() {
    this.invoiceNo = '';
    this.customer = '';
    this.customerAddress1 = '';
    this.customerAddress2 = '';
    this.customerAddress3 = '';
    this.salesDetails = [new SalesDetail(1, '', '', 0, 0, 0, 0, '')];
    this.invoiceDate = moment().format('DD/MM/YYYY');
    this.invoiceDiscount = 0;
  }
}
