import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filters-data',
  templateUrl: './search-filters-data.component.html',
  styleUrls: ['./search-filters-data.component.scss']
})
export class SearchFiltersDataComponent implements OnInit {

  @Output() selectClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }


  onSelectClick() {
    this.selectClick.emit("test");
  }

}
