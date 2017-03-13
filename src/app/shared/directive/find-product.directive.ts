import {Directive, HostListener, Input, Output, EventEmitter} from '@angular/core';
import {ProductService} from "../../product/product.service";
import {DialogService} from "../service/dialog.service";
import {Product} from "../../product/product";

@Directive({
  selector: '[appFindProduct]',
  providers: [ProductService, DialogService]
})
export class FindProductDirective {
  @Input()
  productName:string;
  @Output()
  products:EventEmitter<Product[]> = new EventEmitter<Product[]>();

  constructor(private productService:ProductService, private dialogService:DialogService) {
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event) {
    if (event.ctrlKey && event.keyCode === 80) {
      if (this.productName) {
        this.productService.getProductByField('productName', this.productName).subscribe((res)=> {
          this.products.emit(res);
        });
      } else {
        this.dialogService.showDialog('Please fill the product name field');
      }
    }
  }

}
