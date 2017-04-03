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
  page:number = 0;
  keyword:string = '';
  status:boolean;

  constructor(private productService:ProductService, private router:Router) {
  }

  ngOnInit() {
    this.findFirstProduct();
    this.filterProduct.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      if (keyword) {
        this.keyword = keyword;
        this.findProduct();
      }
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

  private findFirstProduct() {
    this.pleaseWaitActive = true;
    this.productService.getAllProduct((this.page * 10).toString()).subscribe((prod)=> {
      this.products = prod;
      this.pleaseWaitActive = false;
    });
  }

  private findProduct() {
    this.pleaseWaitActive = true;
    this.productService.getProductByField(this.filterProductBy, this.keyword, (this.page * 10).toString()).subscribe((prod)=> {
      this.products = _.uniqBy(_.flatten(prod), 'id');
      this.pleaseWaitActive = false;
    });
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
    Observable.timer(300).do(() => {
      document.getElementById('txtFilter').focus();
    }).subscribe();
  }

  refreshProduct() {
    this.keyword = '';
    this.page = 0;
    this.showFilter = false;
    this.filterProduct.setValue('');
    this.findFirstProduct();
  }

  prev() {
    if (this.page > 0) {
      this.page = this.page - 1;
      if (this.keyword) {
        this.findProduct();
      } else {
        this.findFirstProduct();
      }
    } else {

    }
  }

  next() {
    this.page = this.page + 1;
    if (this.keyword) {
      this.findProduct();
    } else {
      this.findFirstProduct();
    }

  }

}
