import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Supplier} from "./supplier";
import {APP_CONFIG} from "../shared/model/app-properties";

@Injectable()
export class SupplierService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getAllSupllier(page:string) {
    return this.http.get(this.config.serviceBaseUrl + '/supplier?{"$sort": {"supplierName": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getSupplierByField(fieldName:string, fieldValue:string, page:string = '0', sort:string = '{"supplierName": 1}') {
    return this.http.get(this.config.serviceBaseUrl + '/supplier?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},' +
      '"$sort":' + sort + ' ,' +
      '"$skip":' + page + ',' +
      '"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  saveSupplier(sup:Supplier) {
    if (sup) {
      if (sup.id) {
        return this.http.put(this.config.serviceBaseUrl + '/supplier', sup)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post(this.config.serviceBaseUrl + '/supplier', sup)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }
}
