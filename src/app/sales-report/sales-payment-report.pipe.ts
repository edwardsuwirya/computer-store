import {Pipe, PipeTransform} from '@angular/core';
import {SalesPayment} from "./sales-payment";

declare let _:any;
@Pipe({
  name: 'salesPaymentReport'
})
export class SalesPaymentReportPipe implements PipeTransform {

  transform(value:any, args?:any):any {
    let pi = args.split(':');
    let pt:SalesPayment;
    if (pi.length === 2) {
      pt = _.find(value, function (o) {
        return o.paymentType === pi[1];
      });

    } else {
      pt = _.find(value, function (o) {
        return o.paymentType === pi[1] && o.bankName === pi[2];
      });
    }
    if (pi[0] === 'payValue') {
      if (pt) {
        return pt.paymentValue;
      } else {
        return null;
      }
    } else if (pi[0] === 'payDate') {
      if (pt) {
        return pt.paymentDate;
      } else {
        return null;
      }
    } else {
      return null;
    }

  }

}
