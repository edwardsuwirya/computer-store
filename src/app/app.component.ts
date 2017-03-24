import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Madju Computindo';
  todays = new Date();

  constructor(private router:Router) {
  }

  goToList() {
    this.router.navigate(['/']);
    return;
  }
}
