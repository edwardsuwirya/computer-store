import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {APP_CONFIG} from "../shared/model/app-properties";
import {Observable} from "rxjs/Rx";

@Injectable()
export class SalesTotalReportService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getPaidSales() {
    return this.http.get(this.config.supportServiceBaseUrl + '/paidSales')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

  getUnpaidSales() {
    return this.http.get(this.config.supportServiceBaseUrl + '/unpaidSales')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

  getCancelledSales() {
    return this.http.get(this.config.supportServiceBaseUrl + '/cancelledSales')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

  getPaidSalesCount() {
    return this.http.get(this.config.supportServiceBaseUrl + '/paidSalesCount')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

  getUnpaidSalesCount() {
    return this.http.get(this.config.supportServiceBaseUrl + '/unpaidSalesCount')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

  getCancelledSalesCount() {
    return this.http.get(this.config.supportServiceBaseUrl + '/cancelledSalesCount')
      .map(res=>res.json())
      .catch((err) => Observable.throw(err));
  }

}
