import {Component, OnInit} from '@angular/core';
import {Supplier} from "./supplier";
import {Router} from "@angular/router";
import {SupplierService} from "./supplier.service";
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs/Rx";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [SupplierService]
})
export class SupplierComponent implements OnInit {
  pleaseWaitActive:boolean = false;
  suppliers:Supplier[] = [];
  filterSupplier:FormControl = new FormControl('');

  showFilter:boolean = false;
  filterSupplierBy:string = '';
  fieldBy:string = '';

  smallWindow:boolean = false;

  constructor(private supplierService:SupplierService, private router:Router) {
  }

  ngOnInit() {
    this.pleaseWaitActive = true;
    this.supplierService.getAllSupllier().subscribe((sup)=> {
      this.suppliers = sup;
      this.pleaseWaitActive = false;
    });
    this.filterSupplier.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      this.pleaseWaitActive = true;
      this.supplierService.getSupplierByField(this.filterSupplierBy, keyword).subscribe((sup)=> {
        this.suppliers = sup;
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

  newSupplier() {
    this.router.navigate(['supplierUpdate', JSON.stringify(new Supplier())]);
  }

  updateSupplier(sup:Supplier) {
    this.router.navigate(['supplierUpdate', JSON.stringify(sup)]);
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
    this.filterSupplierBy = 'supplier' + field;
    this.filterSupplier.setValue('');
  }
}
