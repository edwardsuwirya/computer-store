import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {SalesService} from "../sales/sales.service";
import {ProductService} from "../product/product.service";
import {CustomerService} from "../customer/customer.service";
import {Customer} from "../customer/customer";
import {Product} from "../product/product";
import {Sales} from "../sales/sales";

declare let _: any;
declare let $: any;

@Component({
  selector: 'app-sales-customer-report',
  templateUrl: './sales-customer-report.component.html',
  styleUrls: ['./sales-customer-report.component.css'],
  providers: [CustomerService, ProductService, SalesService]
})
export class SalesCustomerReportComponent implements OnInit {
  pleaseWaitActive: boolean = false;
  customer: string = '';
  productName: string = '';
  customerFilterForm: FormControl = new FormControl();
  productFilterForm: FormControl = new FormControl();
  customers: Customer[] = [];
  products: Product[] = [];

  sales: Sales[] = [];

  constructor(private customerService: CustomerService,
              private productService: ProductService, private salesService: SalesService) {
    Observable.timer(300).do(() => {
      document.getElementById('customer').focus();
    }).subscribe();
  }

  ngOnInit() {
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
        this.productService.getProductByField('productName', keyword, '0').subscribe((prod) => {
          this.products = prod;
        })
      }
    });
    $('#customerModal').modal();
    $('#productModal').modal();
  }

  onCustomerFilter(event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      this.customerFilterForm.setValue('')
      this.customers = [];
      $('#customerModal').modal('open');
      Observable.timer(300).do(() => {
        document.getElementById('customerFilter').focus();
      }).subscribe();
    }
  }

  onProductFilter(event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      this.productFilterForm.setValue('');
      this.products = [];
      $('#productModal').modal('open');
      Observable.timer(300).do(() => {
        document.getElementById('productFilter').focus();
      }).subscribe();
    }
  }

  onPickCustomer(customer: Customer) {
    this.customer = customer.customerName;
    $('#customerModal').modal('close');
    Observable.timer(300).do(() => {
      document.getElementById('productName').focus();
    }).subscribe();
  }

  onPickProduct(product: Product) {
    this.productName = product.productName;
    $('#productModal').modal('close');
  }

  onFindSales() {
    this.salesService.getSalesBy2Field('salesCustomerName', this.customer, 'salesDetail.productName', this.productName, '0', '{"salesDate":-1}').subscribe((res) => {
      this.sales = res;
    })
  }
}
