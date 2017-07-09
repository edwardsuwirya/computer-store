import {Component, OnInit, Inject} from "@angular/core";
import {Router} from "@angular/router";
import {DialogService} from "../shared/service/dialog.service";
import {Observable} from "rxjs";
import {APP_CONFIG} from "../shared/model/app-properties";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DialogService]
})
export class LoginComponent implements OnInit {
  username:string;
  userpassword:string;

  constructor(@Inject(APP_CONFIG) private appConfig, private router:Router, private dialogService:DialogService) {
  }

  ngOnInit() {
    Observable.timer(300).do(() => {
      document.getElementById('username').focus();
    }).subscribe();
  }

  doLogin() {
    if (this.username === this.appConfig.userName && this.userpassword === this.appConfig.userPwd) {
      localStorage.setItem('LA', '1');
      localStorage.setItem('appName','Toko Komputer');
      localStorage.setItem('appVersion','1.0.0');
      this.router.navigate(['home']);
    } else {
      this.dialogService.showDialog('Invalid login');
    }
  }
}
