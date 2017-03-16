import {SalesDetail} from "./sales-detail";
export class Sales {
  salesNo:string;
  salesDate:Date;
  salesCustomerId:string;
  salesCustomerName:string;
  salesCustomerAddress1:string;
  salesCustomerAddress2:string;
  salesCustomerAddress3:string;
  salesDetail:SalesDetail[];
  salesTotal:number;
  salesDiscount:number;
  salesGrandTotal:number;
  salesPaidStatus:boolean;
  salesDeliveryCharge:number;
  salesDeliveryInfo:string;
  salesComission:number;
  salesComissionInfo:string;
  salesOtherInfo:string;
}
