import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Customer} from "./customer";
import {APP_CONFIG} from "../shared/model/app-properties";

@Injectable()
export class CustomerService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getAllCustomer(page:string) {
    return this.http.get(this.config.serviceBaseUrl + '/customer?{"$sort": {"customerName": 1,"customerNickName":1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getCustomerByField(fieldName:string, fieldValue:string, page:string = '0', sort:string = '{"customerName": 1,"customerNickName":1}') {
    if (fieldName === 'customerAddress') {
      return Observable.forkJoin(
        this.http.get(this.config.serviceBaseUrl +'/customer?{"customerAddress1":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err)),
        this.http.get(this.config.serviceBaseUrl +'/customer?{"customerAddress2":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err)),
        this.http.get(this.config.serviceBaseUrl +'/customer?{"customerAddress3":{"$regex":"' + fieldValue + '", "$options": "i"}}')
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err))
      )
    } else {
      return this.http.get(this.config.serviceBaseUrl +'/customer?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},' +
        '"$sort": ' + sort + ',' +
        '"$skip":' + page + ',' +
        '"$limit":10}')
        .map(res=>res.json())
        .catch((err)=>Observable.throw(err));
    }
  }

  getCustomerBy2Fields(fieldName1:string, fieldValue1:string, fieldName2:string, fieldValue2, page:string = '0', sort:string = '{"customerName": 1,"customerNickName":1}') {
    return this.http.get(this.config.serviceBaseUrl +'/customer?{' +
      '"$and": ' +
      '[{"' + fieldName1 + '":{"$regex":"' + fieldValue1 + '", "$options": "i"}},' +
      '{"' + fieldName2 + '":{"$regex":"' + fieldValue2 + '", "$options": "i"}}],' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',' +
      '"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  saveCustomer(cust:Customer) {
    if (cust) {
      if (cust.id) {
        return this.http.put(this.config.serviceBaseUrl +'/customer', cust)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post(this.config.serviceBaseUrl +'/customer', cust)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }
}
