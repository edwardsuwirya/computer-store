import {Component, OnInit} from '@angular/core';
import {CustomerService} from "../customer/customer.service";
import {FormGroup, FormControl} from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import {Customer} from "../customer/customer";

@Component({
  selector: 'app-customer-update',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css'],
  providers: [CustomerService]
})
export class CustomerUpdateComponent implements OnInit {

  customerUpdateForm:FormGroup;
  pleaseWaitActive:boolean = false;

  constructor(private customerService:CustomerService, private router:Router, private activeRoute:ActivatedRoute) {
  }

  ngOnInit() {
    let customer = this.activeRoute.snapshot.params['customer'];
    if (customer) {
      let s = JSON.parse(customer);
      this.customerUpdateForm = new FormGroup({
        id: new FormControl(s.id),
        customerName: new FormControl(s.customerName),
        customerNickName: new FormControl(s.customerNickName),
        customerAddress1: new FormControl(s.customerAddress1),
        customerAddress2: new FormControl(s.customerAddress2),
        customerAddress3: new FormControl(s.customerAddress3),
        customerPhone: new FormControl(s.customerPhone),
        customerStatus: new FormControl(s.customerStatus === '1' ? true : false)
      });
    }
  }

  saveCustomer() {
    this.pleaseWaitActive = true;
    let newCustomer:Customer = this.customerUpdateForm.value;
    newCustomer.customerStatus ? newCustomer.customerStatus = '1' : newCustomer.customerStatus = '0';
    this.customerService.saveCustomer(newCustomer).subscribe((res) => {
      this.pleaseWaitActive = false;
      this.router.navigate(['customer']);
    });
  }

  goToList() {
    this.router.navigate(['customer']);
    return;
  }
}
