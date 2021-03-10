import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-greetings',
  templateUrl: './greetings.component.html',
  styleUrls: ['./greetings.component.sass']
})
export class GreetingsComponent implements OnInit {
  page = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
