import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionType, ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { fuseAnimations } from "@fuse/animations";



@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReportComponent implements OnInit {

  
  rows: any[] = null;
  ColumnMode = ColumnMode;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  keyword = '';


  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.data.items);
    //console.log(this.route.snapshot.data.items[1].data);

    this.rows = this.route.snapshot.data.items[0].data;
  }

}
