export class SalesDetail {
  id:number;
  idTag:number;
  productId:string;
  productName:string;
  productQty:number;
  discount:number;
  unitPrice:number;
  salesTotal:number;
  salesDetailInfo:string;

  constructor(id?:number, productId?:string,
              productName?:string,
              productQty?:number,
              discount?:number,
              unitPrice?:number,
              salesTotal?:number, salesDetailInfo?:string) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productQty = productQty;
    this.discount = discount;
    this.unitPrice = unitPrice;
    this.salesTotal = salesTotal;
    this.salesDetailInfo = salesDetailInfo;
  }
}
