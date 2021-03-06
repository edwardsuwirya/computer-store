import {Component, OnInit, Input} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'Madju Computindo';
  todays = new Date();
  @Input()
  showHeader:boolean = true;

  constructor(private router:Router) {
  }

  ngOnInit() {
  }

  goToList() {
    this.router.navigate(['/home']);
    return;
  }

  doLogout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
