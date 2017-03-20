import {Injectable} from '@angular/core';
import {SalesPayment} from "./sales-payment";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Sales} from "../sales/sales";

declare let _:any;
@Injectable()
export class SalesPaymentService {

  constructor(private http:Http) {
  }

  getSalesPaymentByField(fieldName:string, fieldValue:string, page:string):Observable<SalesPayment[]> {
    return this.http.get('http://128.199.228.221:2403/sales-payment?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"salesNo": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getPaymentInfo(sales:Sales) {
    return this.http.get('http://128.199.228.221:2403/sales-payment?{"salesNo":"' + sales.salesNo + '"}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  deletePaymentDetail(salesPayment) {
    return this.http.delete('http://128.199.228.221:2403/sales-payment/' + salesPayment.id)
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  createPaymentDetail(salesPayments) {
    if (salesPayments.id) {
      return this.http.put('http://128.199.228.221:2403/sales-payment', salesPayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    } else {
      return this.http.post('http://128.199.228.221:2403/sales-payment', salesPayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }

  }
}
