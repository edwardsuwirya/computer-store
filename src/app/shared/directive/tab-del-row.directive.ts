import {Directive, HostListener, Output, EventEmitter, Input} from '@angular/core';

@Directive({
  selector: '[appTabDelRow]'
})
export class TabDelRowDirective {
  @Input()
  rowId:number;

  @Output()
  rowDelAllowed:EventEmitter<{}> = new EventEmitter<{}>();

  constructor() {
  }

  @HostListener('keydown', ['$event'])
  onKeyUp(event) {
    if (event.ctrlKey && event.keyCode === 82) {
      this.rowDelAllowed.emit({'id': this.rowId, 'allow': true});
    }
  }
}
