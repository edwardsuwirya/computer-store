import {Component, OnInit} from "@angular/core";
import {Product} from "../product/product";
import {Subject, BehaviorSubject, Observable} from "rxjs/Rx";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {DialogService} from "../shared/service/dialog.service";
import {ProductService} from "../product/product.service";
import {Supplier} from "../supplier/supplier";
import {SupplierService} from "../supplier/supplier.service";
import {PurchaseDetail} from "./purchase-detail";
import {Purchase} from "./purchase";
import {PurchaseService} from "./purchase.service";

declare let _:any;
declare let numeral:any;
declare let $:any;
declare let moment:any;
declare let Pikaday:any;

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [DialogService, SupplierService, ProductService, PurchaseService]
})
export class PurchaseComponent implements OnInit {

  pleaseWaitActive:boolean = false;
  purchaseNo:string;
  purchaseDate:string;
  supplierId:string;
  supplier:string = '';
  supplierAddress:string = '';

  purchaseTotal:number = 0;
  purchaseDiscount:number = 0;
  purchaseGrandTotal:number = 0;

  suppliers:Supplier[] = [];
  products:Product[] = [];

  itemSelection:PurchaseDetail;

  purchaseTotalCalc:Subject<number> = new Subject<number>();
  supplierRegistrationComplete:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  productRegistrationComplete:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  purchaseTotalCalc$ = this.purchaseTotalCalc.asObservable();
  supplierRegistrationComplete$ = this.supplierRegistrationComplete.asObservable();
  productRegistrationComplete$ = this.productRegistrationComplete.asObservable();

  purchaseDetails:PurchaseDetail[] = [new PurchaseDetail(1, '', '', 0, 0, 0, 0, '')];


  smallWindow:boolean = false;

  supplierFilterForm:FormControl = new FormControl();
  productFilterForm:FormControl = new FormControl();

  constructor(private router:Router, private dialogService:DialogService,
              private supplierService:SupplierService,
              private productService:ProductService, private purchaseService:PurchaseService) {
    setTimeout(function () {
      document.getElementById('supplier').focus();
    }, 200);
  }

  ngOnInit() {
    this.purchaseTotalCalc$.debounceTime(300).subscribe((res) => {
      let total = 0;
      for (let c of this.purchaseDetails) {
        total = total + ((numeral(c.productQty).value() * numeral(c.unitPrice).value()) - numeral(c.discount).value());
      }
      this.purchaseTotal = numeral(total).format('0,0');
      this.purchaseGrandTotal = numeral(total - numeral(this.purchaseDiscount).value()).format('0,0');
    });

    $('#supplierModal').modal();
    $('#productModal').modal();

    this.checkSmallWindow();
    Observable.fromEvent(window, 'resize').subscribe(() => {
      this.checkSmallWindow();
    });

    this.supplierFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.supplierService.getSupplierByField('supplierName', keyword, '0').subscribe((res) => {
          this.suppliers = res;
        })
      }
    });
    this.productFilterForm.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((keyword) => {
      if (keyword) {
        this.productService.getProductBy2Fields('productName', keyword, 'productStatus', '1', '0').subscribe((prod) => {
          this.products = prod;
        })
      }
    });
    let that = this;
    new Pikaday({
      field: document.getElementById('purchaseDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.purchaseDate = this.getMoment().format('DD/MM/YYYY');
      }
    });
    this.purchaseDate = moment().format('DD/MM/YYYY');
  }

  checkSmallWindow() {
    if (window.screen.height < 700) {
      this.smallWindow = true;
    } else {
      this.smallWindow = false;
    }
  }

  goToList() {
    this.router.navigate(['/']);
    return;
  }

  onAddRow(event) {
    let lastPurchaseDetail = _.takeRight(this.purchaseDetails)[0];
    if (lastPurchaseDetail) {
      let currId = Number(lastPurchaseDetail.id) + 1;
      this.purchaseDetails.push(new PurchaseDetail(currId, '', '', 0, 0, 0, 0, ''));
      setTimeout(function () {
        document.getElementById(currId.toString()).focus();
      }, 300);

    } else {
      this.purchaseDetails.push(new PurchaseDetail(1, '', '', 0, 0, 0, 0, ''));
    }
  }


  onRemoveRow(event) {
    if (this.purchaseDetails.length > 1) {
      if (event.allow) {
        _.remove(this.purchaseDetails, {'id': event.id});
      }
    }
  }


  onCreatePurchase() {
    if (this.supplier && this.purchaseDate && this.purchaseNo) {
      if (numeral(this.purchaseGrandTotal).value() > 0) {
        this.pleaseWaitActive = true;
        let currentPurchase:Purchase = new Purchase();
        currentPurchase.purchaseNo = this.purchaseNo;
        currentPurchase.purchaseDate = moment(this.purchaseDate, 'DD/MM/YYYY').format('YYYY-MM-DD');

        if (this.supplierId) {
          currentPurchase.purchaseSupplierId = this.supplierId;
          currentPurchase.purchaseSupplierName = this.supplier;
          currentPurchase.purchaseSupplierAddress = this.supplierAddress;
          this.supplierRegistrationComplete.next(true);
        } else {
          let newSupp:Supplier = new Supplier();
          newSupp.supplierName = this.supplier;
          newSupp.supplierAddress = this.supplierAddress;
          newSupp.supplierStatus = '1';
          this.supplierService.saveSupplier(newSupp).subscribe((res)=> {
            currentPurchase.purchaseSupplierId = res.id;
            currentPurchase.purchaseSupplierName = this.supplier;
            currentPurchase.purchaseSupplierAddress = this.supplierAddress;
            this.supplierRegistrationComplete.next(true);
          });
        }

        let unregisterProduct:PurchaseDetail[] = [];
        for (let sd of this.purchaseDetails) {
          let isUnregister:boolean = false;
          if (!sd.productId) {
            isUnregister = true;
          }
          sd.productQty = numeral(sd.productQty).value();
          sd.discount = numeral(sd.discount).value();
          sd.unitPrice = numeral(sd.unitPrice).value();
          sd.purchaseTotal = numeral(sd.purchaseTotal).value();
          if (isUnregister) {
            unregisterProduct.push(sd);
          }
        }

        if (unregisterProduct.length > 0) {
          Observable.of(...unregisterProduct).map((sdProd)=> {
            let newProd:Product = new Product();
            newProd.productName = sdProd.productName;
            newProd.productStatus = '1';
            newProd.productStock = -1 * (sdProd.productQty);
            Observable.create((obs)=> {
              this.productService.saveProduct(newProd).subscribe((res)=> {
                sdProd.productId = res.id;
                obs.next();
              });
            }).subscribe();
          }).subscribe(()=> {
          }, ()=> {
          }, ()=> {
            this.productRegistrationComplete.next(true);
          });
        } else {
          this.productRegistrationComplete.next(true);
        }

        currentPurchase.purchaseDetail = this.purchaseDetails;

        currentPurchase.purchaseTotal = numeral(this.purchaseTotal).value();
        currentPurchase.purchaseDiscount = numeral(this.purchaseDiscount).value();
        currentPurchase.purchaseGrandTotal = numeral(this.purchaseGrandTotal).value();
        currentPurchase.purchasePaidStatus = '0';
        currentPurchase.purchaseStatus = '1';

        this.supplierRegistrationComplete$.subscribe((res)=> {
          if (res) {
            this.productRegistrationComplete$.subscribe((res)=> {
              if (res) {
                console.log(currentPurchase);
                this.purchaseService.savePurchase(currentPurchase).subscribe((res)=> {
                  this.router.navigate(['/']);
                  this.pleaseWaitActive = false;
                });
              }
            })
          }
        })
      } else {
        this.dialogService.showDialog('Your purchase grand total is zero/minus');
      }
    } else {
      this.dialogService.showDialog('Please fill supplier & purchase info');
    }
  }

  calculatedPrice(purchaseDetail:PurchaseDetail):number {
    let tot:number = (numeral(purchaseDetail.productQty).value() * numeral(purchaseDetail.unitPrice).value()) - numeral(purchaseDetail.discount).value();
    purchaseDetail.purchaseTotal = tot;
    this.purchaseTotalCalc.next(tot);
    return numeral(tot).format('0,0');
  }

  onSupplierFilter(event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      $('#supplierModal').modal('open');
      setTimeout(function () {
        document.getElementById('supplierFilter').focus();
      }, 300);
    }
  }

  onProductFilter(item:PurchaseDetail, event) {
    let target = event.target;
    if (event.keyCode === 13 || target.className.indexOf('fa') != -1) {
      this.productFilterForm.setValue('');
      this.products = [];
      this.itemSelection = item;
      $('#productModal').modal('open');
      setTimeout(function () {
        document.getElementById('productFilter').focus();
      }, 300);
    }
  }

  onPickSupplier(supplier:Supplier) {
    this.supplierId = supplier.id;
    this.supplier = supplier.supplierName;
    this.supplierAddress = supplier.supplierAddress;
    $('#supplierModal').modal('close');
    setTimeout(function () {
      document.getElementById('purchaseNo').focus();
    }, 300);
  }

  onPickProduct(product:Product) {
    this.itemSelection.productId = product.id;
    this.itemSelection.productName = product.productName;
    $('#productModal').modal('close');
    let that = this;
    setTimeout(function () {
      document.getElementById('item' + that.itemSelection.id).focus();
    }, 300);
  }

  onResetPurchase() {
    this.purchaseNo = '';
    this.supplier = '';
    this.supplierAddress = '';
    this.purchaseDiscount = 0;
    this.purchaseDetails = [new PurchaseDetail(1, '', '', 0, 0, 0, 0, '')];
    this.purchaseDate = moment().format('DD/MM/YYYY');
  }

}
