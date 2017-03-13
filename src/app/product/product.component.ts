import {Component, OnInit} from '@angular/core';
import {Product} from "./product";
import {FormControl} from "@angular/forms";
import {ProductService} from "./product.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";

declare let _:any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [ProductService]
})
export class ProductComponent implements OnInit {
  pleaseWaitActive:boolean = false;
  products:Product[] = [];
  filterProduct:FormControl = new FormControl('');

  showFilter:boolean = false;
  filterProductBy:string = '';
  fieldBy:string = '';

  smallWindow:boolean = false;

  constructor(private productService:ProductService, private router:Router) {
  }

  ngOnInit() {
    this.pleaseWaitActive = true;
    this.productService.getAllProduct().subscribe((cust)=> {
      this.products = cust;
      this.pleaseWaitActive = false;
    });
    this.filterProduct.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      this.pleaseWaitActive = true;
      this.productService.getProductByField(this.filterProductBy, keyword).subscribe((cust)=> {
        this.products = _.uniqBy(_.flatten(cust), 'id');
        this.pleaseWaitActive = false;
      });
    });
    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(()=> {
      this.checkSmallWindow();
    })
  }

  checkSmallWindow() {
    if (window.screen.height < 800) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  newProduct() {
    this.router.navigate(['productUpdate', JSON.stringify(new Product())]);
  }

  updateProduct(cust:Product) {
    this.router.navigate(['productUpdate', JSON.stringify(cust)]);
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
    this.filterProductBy = 'product' + field;
    this.filterProduct.setValue('');
  }

}
