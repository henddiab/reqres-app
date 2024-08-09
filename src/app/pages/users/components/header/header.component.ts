import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // holds the main title for the header
  @Input() mainTitle: string = '';

  constructor() {}

  ngOnInit(): void {}
}
