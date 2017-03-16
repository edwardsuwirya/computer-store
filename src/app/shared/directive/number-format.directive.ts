import {Directive, HostListener, Input} from '@angular/core';

declare let numeral:any;
declare let _:any;

@Directive({
  selector: '[appNumberFormat]'
})
export class NumberFormatDirective {
  @Input('appNumberFormat')
  val:string;

  constructor() {
  }

  @HostListener('keyup', ['$event'])
  onKeyUp(event) {
    let nm = numeral(this.val).value();
    if (nm) {
      event.target.value = numeral(this.val).format(0, 0);
    } else {
      event.target.value = 0;
    }
  }
}
