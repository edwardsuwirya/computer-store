import {SalesDetail} from "./sales-detail";
export class Sales {
  salesDate:Date;
  salesCustomerId:string;
  salesCustomerName:string;
  salesCustomerAddress1:string;
  salesCustomerAddress2:string;
  salesCustomerAddress3:string;
  salesDetail:SalesDetail[];
  salesDiscount:number;
  salesPaidStatus:boolean;
}
