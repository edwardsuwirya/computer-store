import {Directive, HostListener, Input, Output, EventEmitter} from '@angular/core';
import {CustomerService} from "../../customer/customer.service";
import {Customer} from "../../customer/customer";
import {DialogService} from "../service/dialog.service";

@Directive({
  selector: '[appFindCustomer]',
  providers: [CustomerService, DialogService]
})
export class FindCustomerDirective {
  @Input()
  customerName: string;

  @Output()
  customers: EventEmitter<Customer[]> = new EventEmitter<Customer[]>();

  constructor(private customerService: CustomerService, private dialogService: DialogService) {
  }

  private searchCustomer() {
    if (this.customerName) {
      this.customerService.getCustomerByField('customerName', this.customerName).subscribe((res) => {
        this.customers.emit(res);
      });
    } else {
      this.dialogService.showDialog('Please fill the customer name field');
    }
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    let target = event.target;
    if (target.className.indexOf('fa') != -1) {
      this.searchCustomer();
    } else {
      return;
    }
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event) {
    if (event.ctrlKey && event.keyCode === 67) {
      this.searchCustomer();
    } else {
      return;
    }
  }


}
