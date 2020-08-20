import { 
  Component, 
  OnInit, 
  OnDestroy,
  ViewEncapsulation,   
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionType, ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { fuseAnimations } from "@fuse/animations";
import { ReportService } from '../report.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sales-report-bydates',
  templateUrl: './sales-report-bydates.component.html',
  styleUrls: ['./sales-report-bydates.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReportBydatesComponent implements OnInit, OnDestroy, AfterViewChecked {
  // Data table
  @ViewChild("tableWrapper") tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;

  rows: any[] = null;
  ColumnMode = ColumnMode;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  //keyword = '';

  private _unsubscribeAll: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reportService: ReportService,
  ) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.setPage({offset: 0});
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (
      this.table &&
      this.table.recalculate &&
      this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth
    ) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setPage(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    // console.log("Page callback");
    this.reportService.getSalesReportByDates({page: pageInfo.offset + 1 } )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
       this.rows = res.data;

       this.page.offset = pageInfo.offset;
       this.page.count = res.totalCount;
       // console.log(res);
    });
  }

}
