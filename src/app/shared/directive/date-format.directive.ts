import {Directive, Input, HostListener} from '@angular/core';
import {DatePipe} from "@angular/common";

@Directive({
  selector: '[appDateFormat]',
  providers: [DatePipe]
})
export class DateFormatDirective {
  @Input('appDateFormat')
  val:string;

  constructor(private datePipe:DatePipe) {
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event) {
    let myDate:Date;
    if (this.val) {
      let dateParts:string[] = this.val.split('.');
      let yyyy = Number(dateParts[2]);
      let mm = Number(dateParts[1]) - 1;
      let dd = Number(dateParts[0]);
      myDate = new Date(yyyy, mm, dd);
    } else {
      myDate = new Date();
    }
    event.target.value = this.datePipe.transform(myDate, 'dd.MMM.yyyy');
  }
}
