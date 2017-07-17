import {Component, OnInit, ViewChild} from "@angular/core";
import {SalesService} from "../sales/sales.service";
import {SalesForPrintingComponent} from "../sales-for-printing/sales-for-printing.component";
import {Sales} from "../sales/sales";
import {DialogService} from "../shared/service/dialog.service";
import {Router, ActivatedRoute} from "@angular/router";

declare let $:any;

@Component({
  selector: 'app-sales-cancel',
  templateUrl: './sales-cancel.component.html',
  styleUrls: ['./sales-cancel.component.css'],
  providers: [SalesService, DialogService]
})
export class SalesCancelComponent implements OnInit {
  @ViewChild('info')
  salesInfo:SalesForPrintingComponent;
  salesNo:string;
  salesForCancel:Sales;

  salesFound:boolean = false;

  constructor(private salesService:SalesService,
              private activeRoute:ActivatedRoute,
              private router:Router,
              private dialogService:DialogService) {
  }

  ngOnInit() {
    $('#cancelConfirmationModal').modal();
    let salesNo = this.activeRoute.snapshot.params['salesNo'];
    if (salesNo) {
      this.salesNo = salesNo;
      this.onFindSales();
    }
  }

  onFindSales() {
    this.salesService.getSalesBy2Field('salesNo', this.salesNo, 'salesStatus', '1').subscribe((res)=> {
      if(res){
        this.salesForCancel = res[0];
        this.salesInfo.doRefresh(this.salesForCancel);
        this.salesFound = true;
      }else{
        this.salesFound = false;
      }
    })
  }

  onConfirmCancelSales() {
    this.salesForCancel.salesStatus = '0'
    this.salesService.saveSales(this.salesForCancel).subscribe((res)=> {
      $('#cancelConfirmationModal').modal('close');
      this.router.navigate(['/home']);
    }, (err)=> {
      this.dialogService.showDialog('Some error occurred ' + err);
    })
  }

  onIgnoreCancelSales() {
    $('#cancelConfirmationModal').modal('close');
  }

  onCancelSales() {
    if(this.salesFound){
      $('#cancelConfirmationModal').modal('open');
    }
  }
}
