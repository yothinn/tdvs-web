import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.data.items);
    //console.log(this.route.snapshot.data.items[1].data);
  }

}
