import {Component, OnInit} from "@angular/core";
import {Purchase} from "../purchase/purchase";
import {Router, ActivatedRoute} from "@angular/router";
import {DialogService} from "../shared/service/dialog.service";
import {PurchaseService} from "../purchase/purchase.service";
import {PurchaseDetail} from "../purchase/purchase-detail";

declare let $:any;
@Component({
  selector: 'app-purchase-cancel',
  templateUrl: './purchase-cancel.component.html',
  styleUrls: ['./purchase-cancel.component.css'],
  providers: [PurchaseService, DialogService]
})
export class PurchaseCancelComponent implements OnInit {
  purchaseNo:string;
  purchaseForCancel:Purchase = new Purchase();
  purchaseDetail:PurchaseDetail[] = [];

  constructor(private purchaseService:PurchaseService,
              private activeRoute:ActivatedRoute,
              private router:Router,
              private dialogService:DialogService) {
  }

  ngOnInit() {
    $('#cancelConfirmationModal').modal();
    let purchaseNo = this.activeRoute.snapshot.params['purchaseNo'];
    if (purchaseNo) {
      this.purchaseNo = purchaseNo;
      this.onFindPurchase();
    }
  }

  onFindPurchase() {
    this.purchaseService.getPurchaseBy2Field('purchaseNo', this.purchaseNo, 'purchaseStatus', '1').subscribe((res)=> {
      this.purchaseForCancel = res[0];
      this.purchaseDetail = this.purchaseForCancel.purchaseDetail;
    })
  }

  onConfirmCancelPurchase() {
    this.purchaseForCancel.purchaseStatus = '0';
    this.purchaseService.savePurchase(this.purchaseForCancel).subscribe((res)=> {
      $('#cancelConfirmationModal').modal('close');
      this.router.navigate(['/home']);
    }, (err)=> {
      this.dialogService.showDialog('Some error occurred ' + err);
    })
  }

  onIgnoreCancelPurchase() {
    $('#cancelConfirmationModal').modal('close');
  }

  onCancelPurchase() {
    $('#cancelConfirmationModal').modal('open');
  }
}
