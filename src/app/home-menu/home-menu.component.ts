import { Component, OnInit } from '@angular/core';
declare let $:any;
@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.css']
})
export class HomeMenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.collapsible').collapsible();
  }

}
