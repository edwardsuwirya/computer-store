export class PurchaseDetail {
  id:number;
  idTag:number;
  productId:string;
  productName:string;
  productQty:number;
  discount:number;
  unitPrice:number;
  purchaseTotal:number;
  purchaseDetailInfo:string;

  constructor(id?:number, productId?:string,
              productName?:string,
              productQty?:number,
              discount?:number,
              unitPrice?:number,
              purchaseTotal?:number, purchaseDetailInfo?:string) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productQty = productQty;
    this.discount = discount;
    this.unitPrice = unitPrice;
    this.purchaseTotal = purchaseTotal;
    this.purchaseDetailInfo = purchaseDetailInfo;
  }
}
