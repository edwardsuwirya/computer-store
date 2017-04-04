import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {APP_CONFIG} from "../shared/model/app-properties";
import {Observable} from "rxjs/Rx";
import {Purchase} from "./purchase";

@Injectable()
export class PurchaseService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getAllPurchase(page:string) {
    return this.http.get(this.config.serviceBaseUrl + '/purchase?{"$sort": {"purchaseDate": -1},"$skip":' + page + ',"$limit":10}')
      .map(res => res.json())
      .catch((err) => Observable.throw(err));
  }

  getPurchaseByField(fieldName:string, fieldValue:string, page:string = '0', sort:string = '{"purchaseDate": -1}') {
    return this.http.get(this.config.serviceBaseUrl + '/purchase?{"' + fieldName + '":{"$regex":"' + fieldValue + '", ' +
      '"$options": "i"},' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',"$limit":10}')
      .map(res => res.json())
      .catch((err) => Observable.throw(err));
  }

  getPurchaseBy2Field(fieldName1:string, fieldValue1:string, fieldName2:string, fieldValue2:string, page:string = '0', sort:string = '{"purchaseDate": -1}') {
    return this.http.get(this.config.serviceBaseUrl + '/purchase?{' +
      '"$and":[' +
      '{"' + fieldName1 + '":{"$regex":"' + fieldValue1 + '", "$options": "i"}},' +
      '{"' + fieldName2 + '":{"$regex":"' + fieldValue2 + '", "$options": "i"}}' +
      '],' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',' +
      '"$limit":10}')
      .map(res => res.json())
      .catch((err) => Observable.throw(err));
  }

  updatePurchaseInfo(purchase:Purchase) {
    if (purchase) {
      return this.http.put(this.config.serviceBaseUrl + '/purchase/' + purchase.id, purchase)
        .map(res => res.json())
        .catch((err) => Observable.throw(err));
    }
  }

  savePurchase(purchase:Purchase) {
    if (purchase) {
      if (purchase.id) {
        return this.http.put(this.config.serviceBaseUrl + '/purchase', purchase)
          .map(res => res.json())
          .catch((err) => Observable.throw(err));
      } else {
        return this.http.post(this.config.serviceBaseUrl + '/purchase', purchase)
          .map(res => res.json())
          .catch((err) => Observable.throw(err));
      }
    }
  }
}
