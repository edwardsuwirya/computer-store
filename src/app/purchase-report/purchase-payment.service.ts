import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {APP_CONFIG} from "../shared/model/app-properties";
import {Observable} from "rxjs/Rx";
import {PurchasePayment} from "./purchase-payment";
import {Purchase} from "../purchase/purchase";

@Injectable()
export class PurchasePaymentService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getPurchasePaymentByField(fieldName:string, fieldValue:string, page:string):Observable<PurchasePayment[]> {
    return this.http.get(this.config.serviceBaseUrl + '/purchase-payment?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"purchaseNo": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getPaymentInfo(purchase:Purchase) {
    return this.http.get(this.config.serviceBaseUrl + '/purchase-payment?{"purchaseNo":"' + purchase.purchaseNo + '"}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  deletePaymentDetail(purchasePayment) {
    return this.http.delete(this.config.serviceBaseUrl + '/purchase-payment/' + purchasePayment.id)
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  createPaymentDetail(purchasePayments) {
    if (purchasePayments.id) {
      return this.http.put(this.config.serviceBaseUrl + '/purchase-payment', purchasePayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    } else {
      return this.http.post(this.config.serviceBaseUrl + '/purchase-payment', purchasePayments)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }

  }

}
