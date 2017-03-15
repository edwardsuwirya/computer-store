import {Pipe, PipeTransform} from '@angular/core';

declare let numeral:any;
@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value:any, args?:any):any {
    if (value) {
      return numeral(value).format('0,0');
    } else {
      return '0';
    }

  }

}
