import {Injectable, Inject} from "@angular/core";
import {SalesPayment} from "./sales-payment";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Sales} from "../sales/sales";
import {APP_CONFIG} from "../shared/model/app-properties";

declare let _:any;
@Injectable()
export class SalesPaymentService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getSalesPaymentByField(fieldName:string, fieldValue:string, page:string):Observable<SalesPayment[]> {
    return this.http.get(this.config.serviceBaseUrl + '/sales-payment?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"salesNo": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getPaymentInfo(sales:Sales) {
    return this.http.get(this.config.serviceBaseUrl + '/sales-payment?{"salesNo":"' + sales.salesNo + '"}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  deletePaymentDetail(salesPayment) {
    return this.http.delete(this.config.serviceBaseUrl + '/sales-payment/' + salesPayment.id)
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  createPaymentDetail(salesPayments) {
    if (salesPayments.id) {
      return this.http.put(this.config.serviceBaseUrl + '/sales-payment', salesPayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    } else {
      return this.http.post(this.config.serviceBaseUrl + '/sales-payment', salesPayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }

  }
}
