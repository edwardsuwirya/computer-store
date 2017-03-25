import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup, FormControl} from "@angular/forms";
import {Supplier} from "../supplier/supplier";
import {SupplierService} from "../supplier/supplier.service";
import {DialogService} from "../shared/service/dialog.service";

@Component({
  selector: 'app-supplier-update',
  templateUrl: './supplier-update.component.html',
  styleUrls: ['./supplier-update.component.css'],
  providers: [SupplierService]
})
export class SupplierUpdateComponent implements OnInit {
  supplierUpdateForm:FormGroup;
  pleaseWaitActive:boolean = false;

  constructor(private supplierService:SupplierService,
              private router:Router,
              private activeRoute:ActivatedRoute,
              private dialogService:DialogService) {
  }

  ngOnInit() {
    let supplier = this.activeRoute.snapshot.params['supplier'];
    if (supplier) {
      let s = JSON.parse(supplier);
      this.supplierUpdateForm = new FormGroup({
        id: new FormControl(s.id),
        supplierName: new FormControl(s.supplierName),
        supplierAddress: new FormControl(s.supplierAddress),
        supplierPhone: new FormControl(s.supplierPhone),
        supplierBank: new FormControl(s.supplierBank),
        supplierStatus: new FormControl(s.supplierStatus === '1' ? true : false)
      });
    }
  }

  saveSupplier() {
    this.pleaseWaitActive = true;
    let newSupplier:Supplier = this.supplierUpdateForm.value;
    newSupplier.supplierStatus ? newSupplier.supplierStatus = '1' : newSupplier.supplierStatus = '0';
    this.supplierService.saveSupplier(newSupplier).subscribe((res) => {
      this.pleaseWaitActive = false;
      this.router.navigate(['supplier']);
    }, (err)=> {
      this.dialogService.showDialog('Some error occurred ' + err);
    });
  }

  goToList() {
    this.router.navigate(['supplier']);
    return;
  }
}
