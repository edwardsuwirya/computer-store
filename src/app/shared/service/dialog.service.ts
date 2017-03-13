import {Injectable} from '@angular/core';

declare let Materialize:any;

@Injectable()
export class DialogService {

  constructor() {
  }

  showDialog(message:string) {
    Materialize.toast(message, 4000);
  }
}
