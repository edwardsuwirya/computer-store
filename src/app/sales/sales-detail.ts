export class SalesDetail {
  id:number;
  productId:string;
  productName:string;
  productQty:number;
  discount:number;
  unitPrice:number;

  constructor(id:number, productId:string, productName:string, productQty:number, discount:number, unitPrice:number) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.productQty = productQty;
    this.discount = discount;
    this.unitPrice = unitPrice;
  }
}
