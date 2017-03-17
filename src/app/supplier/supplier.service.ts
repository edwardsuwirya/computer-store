import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Supplier} from "./supplier";

@Injectable()
export class SupplierService {

  constructor(private http:Http) {
  }

  getAllSupllier(page:string) {
    return this.http.get('http://128.199.228.221:2403/supplier?{"$sort": {"supplierName": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getSupplierByField(fieldName:string, fieldValue:string, page:string) {
    return this.http.get('http://128.199.228.221:2403/supplier?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"supplierName": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  saveSupplier(sup:Supplier) {
    if (sup) {
      if (sup.id) {
        return this.http.put('http://128.199.228.221:2403/supplier', sup)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post('http://128.199.228.221:2403/supplier', sup)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }
}
