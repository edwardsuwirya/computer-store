import {SalesDetail} from "./sales-detail";
import {SalesPayment} from "../sales-report/sales-payment";
export class Sales {
  id:string;
  salesNo:string;
  salesDate:string;
  salesCustomerId:string;
  salesCustomerName:string;
  salesCustomerAddress1:string;
  salesCustomerAddress2:string;
  salesCustomerAddress3:string;
  salesDetail:SalesDetail[];
  salesTotal:number;
  salesDiscount:number;
  salesGrandTotal:number;
  salesPaidStatus:string;
  salesDeliveryCharge:number;
  salesDeliveryInfo:string;
  salesComission:number;
  salesComissionInfo:string;
  salesOtherInfo:string;
  salesPayment:SalesPayment[];
  salesStatus:string;
  purchaseOrderNo:string;
}
