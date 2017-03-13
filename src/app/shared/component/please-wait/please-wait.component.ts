import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-please-wait',
  templateUrl: './please-wait.component.html',
  styleUrls: ['./please-wait.component.css']
})
export class PleaseWaitComponent implements OnInit {
  @Input()
  pleaseWaitActive:boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
