import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Customer} from "./customer";

@Injectable()
export class CustomerService {

  constructor(private http:Http) {
  }

  getAllCustomer(page:string) {
    return this.http.get('http://128.199.228.221:2403/customer?{"$sort": {"customerName": 1,"customerNickName":1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getCustomerByField(fieldName:string, fieldValue:string, page:string) {
    if (fieldName === 'customerAddress') {
      return Observable.forkJoin(
        this.http.get('http://128.199.228.221:2403/customer?{"customerAddress1":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err)),
        this.http.get('http://128.199.228.221:2403/customer?{"customerAddress2":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err)),
        this.http.get('http://128.199.228.221:2403/customer?{"customerAddress3":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err))
      )
    } else {
      return this.http.get('http://128.199.228.221:2403/customer?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},"$sort": {"customerName": 1,"customerNickName":1},"$skip":' + page + ',"$limit":10}')
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }

  }

  saveCustomer(cust:Customer) {
    if (cust) {
      if (cust.id) {
        return this.http.put('http://128.199.228.221:2403/customer', cust)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post('http://128.199.228.221:2403/customer', cust)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }
}
