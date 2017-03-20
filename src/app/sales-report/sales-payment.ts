export class SalesPayment {
  id:number;
  paymentDate:string;
  salesNo:string;
  paymentType:string;
  bankName:string;
  paymentValue:number;

  constructor(paymentDate?:string, salesNo?:string, paymentType?:string, bankName?:string, paymentValue?:number) {
    this.paymentDate = paymentDate;
    this.salesNo = salesNo;
    this.paymentType = paymentType;
    this.bankName = bankName;
    this.paymentValue = paymentValue;
  }

}
