import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { VehicleService } from '../services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogConfirmService } from 'app/dialog-confirm/service/dialog-confirm.service';
import * as moment from "moment";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicleList.component.html',
  styleUrls: ['./vehicleList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicleListComponent implements OnInit {

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;

  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  keyword = "";

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService,
    public dialogConfirmService: DialogConfirmService,
    private _snackBar: MatSnackBar,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    this.page.count = this.route.snapshot.data.items.totalCount;
    this.formatMoment();
  }

  // For resize data table
  ngAfterViewChecked(): void {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {

      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
    }
  }

  formatMoment() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      row.startDate = moment(row.startDate).format("DD/MM/YYYY");
      if(row.endDate){
        row.endDate = moment(row.endDate).format("DD/MM/YYYY");
      }else{
        row.endDate = "ไม่กำหนด";
      }
      
    }
  }

  addData() {
    this.router.navigateByUrl("/vehicle/vehicleForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/vehicle/vehicleForm/" + item._id);
  }


  deleteData(item) {
    const body = {
      title: "กรุณายืนยันการ ลบรายการ",
      message: "ตารางเวลารถทะเบียน : " + item.lisenceID,
    };

    this.dialogConfirmService.show(body).then(async (result) => {
      if (result) {
        this.spinner.show();
        this.vehicleService.deleteVehicleData(item).then((res) => {
          this._snackBar.open("ลบข้อมูลการจัดการรถเสร็จสิ้น", "", {
            duration: 5000,
          });
          this.reloadData();
          this.formatMoment();
          this.spinner.hide();

          // });
        }).catch((res) => {
          this._snackBar.open("การลบผิดพลาด กรุณาลองใหม่ภายหลัง", "", {
            duration: 5000,
          });
        });
      };
    });

  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.reloadData();
  }

  async reloadData() {
    let res: any = await this.vehicleService.getVehicleDataList(
      this.page.offset,
      this.page.limit,
      this.keyword
    );
    this.rows = res.data;
    this.temp = res.data;
    this.page.count = res.totalCount;
    this.formatMoment();
  }

  updateFilter(event) {
    //change search keyword to lower case
    // const val = event.target.value.toLowerCase();

    // filter our data
    this.keyword = event.target.value;
    this.reloadData();
    this.page.offset = 0;

  }

}
