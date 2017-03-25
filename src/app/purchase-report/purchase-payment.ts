export class PurchasePayment {
  id:number;
  paymentDate:string;
  purchaseNo:string;
  paymentType:string;
  bankName:string;
  paymentValue:number;

  constructor(paymentDate?:string, purchaseNo?:string, paymentType?:string, bankName?:string, paymentValue?:number) {
    this.paymentDate = paymentDate;
    this.purchaseNo = purchaseNo;
    this.paymentType = paymentType;
    this.bankName = bankName;
    this.paymentValue = paymentValue;
  }

}
