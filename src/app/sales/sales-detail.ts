export class SalesDetail {
  id:number;
  productName:string;
  productQty:number;
  discount:number;
  unitPrice:number;

  constructor(id:number, productName:string, productQty:number, discount:number, unitPrice:number) {
    this.id = id;
    this.productName = productName;
    this.productQty = productQty;
    this.discount = discount;
    this.unitPrice = unitPrice;
  }
}
