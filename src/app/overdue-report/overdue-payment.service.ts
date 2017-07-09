import {Injectable, Inject} from "@angular/core";
import {Http} from "@angular/http";
import {APP_CONFIG, appConfig} from "../shared/model/app-properties";
import {Observable} from "rxjs/Rx";

declare let moment:any;

@Injectable()
export class OverduePaymentService {

  constructor(@Inject(APP_CONFIG) private config, private http:Http) {
  }

  getAllOverdue() {
    return this.http.get(this.config.serviceBaseUrl + '/sales?{' +
      '"$and":[' +
      '{"salesPaidStatus":{"$regex":"0", "$options": "i"}},' +
      '{"salesStatus":{"$regex":"1", "$options": "i"}}' +
      '],' +
      '"$sort": {"salesNo": 1}}')
      .map(res => {
        let sales = res.json();
        let overdueSales = sales
          .filter(o3=> {
            let salesDate = moment(o3.salesDate).format('YYYY-MM-DD');
            return moment().diff(salesDate, 'months', true) >= Number(appConfig.overdue);
          })
        return overdueSales;
      })
      .catch((err) => Observable.throw(err));
  }
}
