import {CanActivate} from "@angular/router";
import {Injectable} from "@angular/core";
/**
 * Created by edo on 01/04/2017.
 */
@Injectable()
export class RouterGuard implements CanActivate {

  constructor() {
  }

  canActivate() {
    if (localStorage.getItem('LA') === '1') {
      return true;
    } else {
      return false;
    }

  }
}
