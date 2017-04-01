import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Rx";
import {Sales} from "./sales";
import {APP_CONFIG} from "../shared/model/app-properties";

declare let numeral:any;
@Injectable()
export class SalesService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getRunningNumberSales(fieldValue:string) {
    return this.http.get(this.config.serviceBaseUrl + '/sales?{"salesNo":{"$regex":"' + fieldValue + '", ' +
      '"$options": "i"},' +
      '"$sort": {"salesNo": -1},' +
      '"$limit":1}')
      .map(res => {
        if (res) {
          let maxSalesNo = res.json();
          if (maxSalesNo[0]) {
            let runningNumSalesNo:number = numeral(maxSalesNo[0].salesNo.substr(4)).value() + 1;
            return fieldValue + numeral(runningNumSalesNo).format('000');
          } else {
            return fieldValue + '001';
          }
        } else {
          return fieldValue + '001';
        }
      })
      .catch((err) => Observable.throw(err));
  }

  getAllSales(page:string) {
    return this.http.get(this.config.serviceBaseUrl + '/sales?{"$sort": {"salesNo": -1},"$skip":' + page + ',"$limit":10}')
      .map(res => res.json())
      .catch((err) => Observable.throw(err));
  }

  getSalesByField(fieldName:string, fieldValue:string, page:string = '0', sort:string = '{"salesNo": -1}') {
    return this.http.get(this.config.serviceBaseUrl + '/sales?{"' + fieldName + '":{"$regex":"' + fieldValue + '", ' +
      '"$options": "i"},' +
      '"$sort": ' + sort + ',' +
      '"$skip":' + page + ',"$limit":10}')
      .map(res => res.json())
      .catch((err) => Observable.throw(err));
  }

  getSalesBy2Field(fieldName1:string, fieldValue1:string, fieldName2:string, fieldValue2:string, page:string = '0', sort:string = '{"salesNo": -1}') {
    return this.http.get(this.config.serviceBaseUrl + '/sales?{' +
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

  updateSalesInfo(sales:Sales) {
    if (sales) {
      return this.http.put(this.config.serviceBaseUrl + '/sales/' + sales.id, sales)
        .map(res => res.json())
        .catch((err) => Observable.throw(err));
    }
  }

  saveSales(sales:Sales) {
    if (sales) {
      if (sales.id) {
        return this.http.put(this.config.serviceBaseUrl + '/sales', sales)
          .map(res => res.json())
          .catch((err) => Observable.throw(err));
      } else {
        return this.http.post(this.config.serviceBaseUrl + '/sales', sales)
          .map(res => res.json())
          .catch((err) => Observable.throw(err));
      }
    }
  }
}
