import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { TvdscustomerService } from "../services/tvdscustomer.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogConfirmService } from "app/dialog-confirm/service/dialog-confirm.service";
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "app-tvdscustomer-list",
  templateUrl: "./tvdscustomerList.component.html",
  styleUrls: ["./tvdscustomerList.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TvdscustomerListComponent implements OnInit {
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
    private tvdscustomerService: TvdscustomerService,
    private spinner: NgxSpinnerService,
    public dialogConfirmService: DialogConfirmService,
    private _snackBar: MatSnackBar
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    console.log(environment.apiUrl);
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    this.page.count = this.route.snapshot.data.items.totalCount;
    this.formatMoment();
  }

  formatMoment() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      row.created = moment(row.created).format("DD/MM/YYYY");
      row.updated = moment(row.updated).format("DD/MM/YYYY");
    }
  }

  addData() {
    this.router.navigateByUrl("/tvdscustomer/tvdscustomerForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/tvdscustomer/tvdscustomerForm/" + item._id);
  }

  // deleteData(item) {
  //   const body = {
  //     title: "คุณกำลังลบใบสั่งงาน: " + item.docno,
  //     message: "คุณได้ตรวจสอบและยืนยันการลบนี้แล้วใช่หรือไม่?",
  //   };

  //   this.dialogConfirmService.show(body).then(async (result) => {
  //     if (result) {
  //       this.spinner.show();
  //       this.joborderService.deleteJoborderData(item).then((res) => {
  //         this._snackBar.open("ลบใบสั่งงานเสร็จสิ้น", "", {
  //           duration: 5000,
  //         });
  //         this.joborderService.getJoborderDataList().subscribe((res: any) => {
  //           this.rows = res.data;
  //           this.formatMoment();
  //           this.sortRows();
  //           this.spinner.hide();
  //         });
  //       }).catch((res)=>{
  //         this._snackBar.open("การลบผิดพลาด กรุณาลองใหม่ภายหลัง", "", {
  //           duration: 5000,
  //         });
  //       });
  //     };
  //   });

  // }

  async deleteData(item) {
    const body = {
      title: "คุณกำลังลบข้อมูล" + " " + item.displayName,
      message: "คุณได้ตรวจสอบและยืนยันการลบนี้แล้วใช่หรือไม่?",
    };
    this.dialogConfirmService.show(body).then(async (result) => {
      if (result) {
        this.spinner.show();
        // let deleted = await this.tvdscustomerService.deleteTvdscustomerData(
        //   item
        // );
        this.tvdscustomerService.deleteTvdscustomerData(item).then((res) => {
          this._snackBar.open("ลบข้อมูลสมาชิกเสร็จสิ้น", "", {
            duration: 5000,
          });
          this.reloadData();
          this.formatMoment();
          this.spinner.hide();
        }).catch((res) => {
          this._snackBar.open("การลบผิดพลาด กรุณาลองใหม่ภายหลัง", "", {
            duration: 5000,
          });
        });
        // this.tvdscustomerService.deleteTvdscustomerData(item).then((res) => {
        //   this.tvdscustomerService.getTvdscustomerDataList().subscribe((res: any) => {
        //     this.rows = res.data;
        //   })
        // })
      }
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
    console.log(this.keyword);
    let res: any = await this.tvdscustomerService.getTvdscustomerDataList(
      this.page.offset,
      this.page.limit,
      this.keyword
    );
    console.log(res.data);
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
