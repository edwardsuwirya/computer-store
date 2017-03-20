import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Sales} from "./sales";

@Injectable()
export class SalesService {

  constructor(private http:Http) {
  }

  getAllSales(page:string) {
    return this.http.get('http://128.199.228.221:2403/sales?{"$sort": {"salesNo": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getSalesByField(fieldName:string, fieldValue:string, page:string) {
    return this.http.get('http://128.199.228.221:2403/sales?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"salesNo": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  updateSalesInfo(sales:Sales) {
    if (sales) {
      return this.http.put('http://128.199.228.221:2403/sales/' + sales.id, sales)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }
  }

  saveSales(sales:Sales) {
    if (sales) {
      return this.http.post('http://128.199.228.221:2403/sales', sales)
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }
  }
}
