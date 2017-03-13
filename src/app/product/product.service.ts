import {Injectable} from '@angular/core';
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Product} from "./product";

@Injectable()
export class ProductService {
  constructor(private http:Http) {
  }

  getAllProduct() {
    return this.http.get('http://128.199.228.221:2403/product')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  getProductByField(fieldName:string, fieldValue:string) {
    return this.http.get('http://128.199.228.221:2403/product?{"' + fieldName + '":{"$regex":"' + fieldValue + '", "$options": "i"}}')
      .map(res=>res.json())
      .catch((err)=>Observable.throw(err));
  }

  saveProduct(prod:Product) {
    if (prod) {
      if (prod.id) {
        return this.http.put('http://128.199.228.221:2403/product', prod)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      } else {
        return this.http.post('http://128.199.228.221:2403/product', prod)
          .map(res=>res.json())
          .catch((err)=>Observable.throw(err));
      }

    }

  }

}
