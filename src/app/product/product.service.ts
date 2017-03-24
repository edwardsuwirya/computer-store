import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Product} from "./product";
import {APP_CONFIG} from "../shared/model/app-properties";

@Injectable()
export class ProductService {
  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getAllProduct(page:string) {
    return this.http.get(this.config.serviceBaseUrl + '/product?{"$sort": {"productName": 1},"$skip":' + page + ',"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getProductByField(fieldName:string, fieldValue:string, page:string = '0', sort:string = '{"productName": 1}') {
    return this.http.get(this.config.serviceBaseUrl + '/product?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"},' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',' +
      '"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getProductBy2Fields(fieldName1:string, fieldValue1:string, fieldName2:string, fieldValue2, page:string = '0', sort:string = '{"productName": 1}') {
    return this.http.get(this.config.serviceBaseUrl + '/product?{' +
      '"$and": ' +
      '[{"' + fieldName1 + '":{"$regex":"' + fieldValue1 + '", "$options": "i"}},' +
      '{"' + fieldName2 + '":{"$regex":"' + fieldValue2 + '", "$options": "i"}}],' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',' +
      '"$limit":10}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  saveProduct(prod:Product) {
    if (prod) {
      if (prod.id) {
        return this.http.put(this.config.serviceBaseUrl + '/product', prod)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post(this.config.serviceBaseUrl + '/product', prod)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }

}
