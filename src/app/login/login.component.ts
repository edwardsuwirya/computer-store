import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {DialogService} from "../shared/service/dialog.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DialogService]
})
export class LoginComponent implements OnInit {
  username:string;
  userpassword:string;

  constructor(private router:Router, private dialogService:DialogService) {
  }

  ngOnInit() {
  }

  doLogin() {
    if (this.username === 'madju' && this.userpassword === 'madjucom') {
      localStorage.setItem('LA', '1');
      this.router.navigate(['home']);
    } else {
      this.dialogService.showDialog('Invalid login');
    }
  }
}
