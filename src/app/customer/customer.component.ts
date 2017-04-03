import {Component, OnInit} from '@angular/core';
import {Customer} from "./customer";
import {FormControl} from "@angular/forms";
import {CustomerService} from "./customer.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

declare let _: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [CustomerService]
})
export class CustomerComponent implements OnInit {
  pleaseWaitActive: boolean = false;
  customers: Customer[] = [];
  filterCustomer: FormControl = new FormControl('');

  showFilter: boolean = false;
  filterCustomerBy: string = '';
  fieldBy: string = '';

  smallWindow: boolean = false;
  page: number = 0;
  keyword: string = '';

  constructor(private customerService: CustomerService, private router: Router) {
  }

  ngOnInit() {
    this.findFirstCustomer();

    this.filterCustomer.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.keyword = keyword;
        this.findCustomer();
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

  private findFirstCustomer() {
    this.pleaseWaitActive = true;
    this.customerService.getAllCustomer((this.page * 10).toString()).subscribe((cust) => {
      this.customers = cust;
      this.pleaseWaitActive = false;
    });
  }

  private findCustomer() {
    this.pleaseWaitActive = true;
    this.customerService.getCustomerByField(this.filterCustomerBy, this.keyword, (this.page * 10).toString()).subscribe((cust) => {
      this.customers = _.uniqBy(_.flatten(cust), 'id');
      this.pleaseWaitActive = false;
    });
  }

  newCustomer() {
    this.router.navigate(['customerUpdate', JSON.stringify(new Customer())]);
  }

  updateCustomer(cust: Customer) {
    this.router.navigate(['customerUpdate', JSON.stringify(cust)]);
  }

  showSearchBar(field: string) {
    if (this.fieldBy === field) {
      this.showFilter = !this.showFilter;
    } else {
      if (!this.showFilter) {
        this.showFilter = true;
      }
    }
    this.fieldBy = field;
    this.filterCustomerBy = 'customer' + field;
    this.filterCustomer.setValue('');
    Observable.timer(300).do(() => {
      document.getElementById('txtFilter').focus();
    }).subscribe();
  }

  refreshCustomer() {
    this.keyword = '';
    this.page = 0;
    this.showFilter = false;
    this.filterCustomer.setValue('');
    this.findFirstCustomer();
  }


  prev() {
    if (this.page > 0) {
      this.page = this.page - 1;
      if (this.keyword) {
        this.findCustomer();
      } else {
        this.findFirstCustomer();
      }
    } else {

    }
  }

  next() {
    this.page = this.page + 1;
    if (this.keyword) {
      this.findCustomer();
    } else {
      this.findFirstCustomer();
    }

  }
}
