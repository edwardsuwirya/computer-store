import {PurchaseDetail} from "./purchase-detail";
import {PurchasePayment} from "../purchase-report/purchase-payment";
export class Purchase {
  id:string;
  purchaseNo:string;
  purchaseDate:string;
  purchaseSupplierId:string;
  purchaseSupplierName:string;
  purchaseSupplierAddress:string;
  purchaseDetail:PurchaseDetail[];
  purchaseTotal:number;
  purchaseDiscount:number;
  purchaseGrandTotal:number;
  purchasePaidStatus:string;
  purchaseOtherInfo:string;
  purchasePayment:PurchasePayment[];
  purchaseStatus:string;
}
