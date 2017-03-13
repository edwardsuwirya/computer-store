import {Directive, HostListener, Output, EventEmitter} from '@angular/core';

@Directive({
  selector: '[appTabNewRow]'
})
export class TabNewRowDirective {

  @Output()
  appTabNewRow:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  @HostListener('keydown', ['$event'])
  onKeyUp(event) {
    if (event.keyCode === 13) {
      this.appTabNewRow.emit(true);
    }
  }
}
