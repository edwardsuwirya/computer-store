import {Component, OnInit} from "@angular/core";
import {PricePipe} from "../shared/pipe/price.pipe";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {Purchase} from "../purchase/purchase";
import {PurchaseDetail} from "../purchase/purchase-detail";
import {PurchaseService} from "../purchase/purchase.service";
import {PurchasePaymentService} from "./purchase-payment.service";
import {PurchasePayment} from "./purchase-payment";

declare let _:any;
declare let $:any;
declare let numeral:any;
declare let moment:any;
declare let Pikaday:any;

@Component({
  selector: 'app-purchase-report',
  templateUrl: './purchase-report.component.html',
  styleUrls: ['./purchase-report.component.css'],
  providers: [PurchasePaymentService, PurchaseService, PricePipe]
})
export class PurchaseReportComponent implements OnInit {
  page:number = 0;
  pleaseWaitActive:boolean = false;

  purchase:Purchase[] = [];
  purchasePayment:PurchasePayment = new PurchasePayment();
  purchaseForUpdate:Purchase = new Purchase();

  bankNameDisabled:boolean = false;
  fieldBy:string = '';
  showFilter:boolean = false;
  filterPurchaseBy:string = '';
  filterPurchase:FormControl = new FormControl('');
  keyword:string = '';
  purchaseDetail:PurchaseDetail[] = [];

  smallWindow:boolean = false;

  constructor(private router:Router, private purchasePaymentService:PurchasePaymentService, private purchaseService:PurchaseService) {
  }

  ngOnInit() {
    this.refreshPurchase();
    this.filterPurchase.valueChanges.debounceTime(500).distinctUntilChanged().subscribe((keyword)=> {
      if (keyword) {
        this.keyword = keyword;
        this.findPurchase();
      }
    });
    $('#paymentModal').modal();
    $('#purchaseDetailModal').modal();
    let that = this;
    new Pikaday({
      field: document.getElementById('paymentDate'),
      format: 'DD/MM/YYYY',
      onSelect: function () {
        that.purchasePayment.paymentDate = this.getMoment().format('DD/MM/YYYY');
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

  private findPurchase() {
    this.pleaseWaitActive = true;
    this.purchaseService.getPurchaseBy2Field(this.filterPurchaseBy, this.keyword, 'purchaseStatus', '1', (this.page * 10).toString()).subscribe((purchase)=> {
      this.purchase = _.uniqBy(_.flatten(purchase), 'id');
      for (let s of this.purchase) {
        this.purchasePaymentService.getPurchasePaymentByField('purchaseNo', s.purchaseNo, '0').subscribe((res)=> {
          s.purchasePayment = res;
        });
      }
      this.pleaseWaitActive = false;
    });
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
    this.filterPurchaseBy = 'purchase' + field;
    this.filterPurchase.setValue('');
    setTimeout(function () {
      document.getElementById('txtFilter').focus();
    }, 200);
  }

  viewPurchaseDetail(purchase:Purchase) {
    this.purchaseForUpdate = purchase;
    this.purchaseDetail = purchase.purchaseDetail;
    $('#purchaseDetailModal').modal('open');
  }

  refreshPurchase() {
    this.pleaseWaitActive = true;
    this.showFilter = false;
    this.filterPurchase.setValue('');
    this.keyword = '';
    this.purchaseService.getAllPurchase((this.page * 10).toString()).subscribe((res)=> {
      this.purchase = res;
      for (let s of res) {
        this.purchasePaymentService.getPurchasePaymentByField('purchaseNo', s.purchaseNo, '0').subscribe((res)=> {
          s.purchasePayment = res;
        });
      }
      this.pleaseWaitActive = false;
    });
  }

  refreshPaidStatus() {
    this.purchasePaymentService.getPurchasePaymentByField('salesNo', this.purchaseForUpdate.purchaseNo, '0').subscribe((res)=> {
      let grandTotal = this.purchaseForUpdate.purchaseTotal - this.purchaseForUpdate.purchaseDiscount;
      let totalPayment:number = 0;
      for (let r of res) {
        totalPayment = totalPayment + r.paymentValue;
      }
      let nominalAccured:number = grandTotal - totalPayment;
      if (nominalAccured > 0) {
        this.purchaseForUpdate.purchasePaidStatus = '0';
      } else {
        this.purchaseForUpdate.purchasePaidStatus = '1';
      }
      this.purchaseService.updatePurchaseInfo(this.purchaseForUpdate).subscribe((res)=> {
        this.findPurchase();
        $('#paymentModal').modal('close');
        this.pleaseWaitActive = false;
      });
    });
  }

  onDeletePayment(purchasePayment:PurchasePayment, purchase:Purchase) {
    this.purchaseForUpdate = purchase;
    this.purchasePaymentService.deletePaymentDetail(purchasePayment).subscribe(()=> {
      this.refreshPaidStatus();
    });
  }

  purchasePaymentTotalCalculation(purchasePayment:PurchasePayment[]):number {
    if (purchasePayment) {
      let totalPayment:number = 0;
      for (let ssp of purchasePayment) {
        totalPayment = totalPayment + numeral(ssp.paymentValue).value();
      }
      return totalPayment;
    } else {
      return 0;
    }
  }

  onUpdatePaymentMethod(purchase:Purchase) {
    this.purchaseForUpdate = purchase;
    this.purchasePayment = new PurchasePayment();
    $('#paymentModal').modal('open');
  }

  onDoPayment() {
    this.pleaseWaitActive = true;
    this.purchasePayment.paymentValue = numeral(this.purchasePayment.paymentValue).value();
    this.purchasePayment.paymentDate = moment(this.purchasePayment.paymentDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.purchasePayment.purchaseNo = this.purchaseForUpdate.purchaseNo;
    this.purchasePaymentService.createPaymentDetail(this.purchasePayment).subscribe(()=> {
      this.refreshPaidStatus();
    });
  }

  prev() {
    if (this.page > 0) {
      this.page = this.page - 1;
      if (this.keyword) {
        this.findPurchase();
      } else {
        this.refreshPurchase();
      }
    } else {
    }
  }

  next() {
    this.page = this.page + 1;
    if (this.keyword) {
      this.findPurchase();
    } else {
      this.refreshPurchase();
    }
  }

}
