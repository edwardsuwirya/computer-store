import {Component, OnInit} from "@angular/core";
import {FormGroup, FormControl} from "@angular/forms";
import {ProductService} from "../product/product.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Product} from "../product/product";
import {DialogService} from "../shared/service/dialog.service";

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
  providers: [ProductService]
})
export class ProductUpdateComponent implements OnInit {
  productUpdateForm:FormGroup;
  pleaseWaitActive:boolean = false;

  constructor(private productService:ProductService,
              private router:Router,
              private activeRoute:ActivatedRoute,
              private dialogService:DialogService) {
  }

  ngOnInit() {
    let product = this.activeRoute.snapshot.params['product'];
    if (product) {
      let s = JSON.parse(product);
      this.productUpdateForm = new FormGroup({
        id: new FormControl(s.id),
        productId: new FormControl(s.productId),
        productBarcode: new FormControl(s.productBarcode),
        productName: new FormControl(s.productName),
        productSpesification: new FormControl(s.productSpesification),
        productDescription: new FormControl(s.productDescription),
        productLastPrice: new FormControl(s.productLastPrice),
        productStock: new FormControl(s.productStock),
        productStatus: new FormControl(s.productStatus === '1' ? true : false)
      });
    }
  }

  saveProduct() {
    this.pleaseWaitActive = true;
    let newProduct:Product = this.productUpdateForm.value;
    newProduct.productStatus ? newProduct.productStatus = '1' : newProduct.productStatus = '0';
    this.productService.saveProduct(newProduct).subscribe((res) => {
      this.pleaseWaitActive = false;
      this.router.navigate(['product']);
    }, (err)=> {
      this.dialogService.showDialog('Some error occurred ' + err);
    });
  }

  goToList() {
    this.router.navigate(['product']);
    return;
  }

}
