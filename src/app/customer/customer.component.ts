import {Component, OnInit} from '@angular/core';
import {Customer} from "./customer";
import {FormControl} from "@angular/forms";
import {CustomerService} from "./customer.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

declare let _:any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [CustomerService]
})
export class CustomerComponent implements OnInit {
  pleaseWaitActive:boolean = false;
  customers:Customer[] = [];
  filterCustomer:FormControl = new FormControl('');

  showFilter:boolean = false;
  filterCustomerBy:string = '';
  fieldBy:string = '';

  smallWindow:boolean = false;

  constructor(private customerService:CustomerService, private router:Router) {
  }

  ngOnInit() {
    this.pleaseWaitActive = true;
    this.customerService.getAllCustomer().subscribe((cust)=> {
      this.customers = cust;
      this.pleaseWaitActive = false;
    });

    this.filterCustomer.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      this.pleaseWaitActive = true;
      this.customerService.getCustomerByField(this.filterCustomerBy, keyword).subscribe((cust)=> {
        this.customers = _.uniqBy(_.flatten(cust), 'id');
        this.pleaseWaitActive = false;
      });
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

  newCustomer() {
    this.router.navigate(['customerUpdate', JSON.stringify(new Customer())]);
  }

  updateCustomer(cust:Customer) {
    this.router.navigate(['customerUpdate', JSON.stringify(cust)]);
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
    this.filterCustomerBy = 'customer' + field;
    this.filterCustomer.setValue('');
  }
}
