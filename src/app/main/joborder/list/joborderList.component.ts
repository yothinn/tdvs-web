import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { JoborderService } from "../services/joborder.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";
// import { jsPDF } from 'jspdf';
import * as jsPDF from "jspdf";
import { DialogConfirmService } from "app/dialog-confirm/service/dialog-confirm.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-joborder-list",
  templateUrl: "./joborderList.component.html",
  styleUrls: ["./joborderList.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class JoborderListComponent implements OnInit,AfterViewChecked {
  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;

  rows: Array<any>;
  temp = [];
  // columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company', sortable: false }];
  ColumnMode = ColumnMode;

  page = {
    limit: 10,
    count: 0,
    offset: 0,
    orderBy: 'docdate',
    orderDir: 'desc'
  };
  keyword = "";

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private joborderService: JoborderService,
    public dialogConfirmService: DialogConfirmService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    this.spinner.hide();

    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    this.page.count = this.route.snapshot.data.items.totalCount;

    console.log(this.rows);
    this.formatMoment();
    // this.sortRows();
  }

  ngAfterViewChecked() {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {
      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
    }
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

  sortCallback(sortInfo: { sorts: { dir: string, prop: string }[], column: {}, prevValue: string, newValue: string }) {
    // there will always be one "sort" object if "sortType" is set to "single"
    console.log(sortInfo);
    this.page.orderDir = sortInfo.sorts[0].dir;
    this.page.orderBy = sortInfo.sorts[0].prop;
    this.reloadData();
  }

  async reloadData() {
    let res: any = await this.joborderService.getJoborderDataList(
      this.page.offset,
      this.page.limit,
      this.keyword,
      this.page.orderBy,
      this.page.orderDir
    );
    this.rows = res.data;
    this.temp = res.data;
    this.page.count = res.totalCount;
    this.formatMoment();
  }

  formatMoment() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      row.docdate = moment(row.docdate).format("DD/MM/YYYY");
      // row.docdate = moment(row.docdate).format();
    }
  }

  sortRows() {
    this.rows.reverse();
  }

  addData() {
    this.router.navigateByUrl("/joborder/joborderForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/joborder/joborderForm/" + item._id);
  }

  changeStatusData(item, status) {
    // console.log(item);
    let body = {
      orderStatus: status,
    };
    this.joborderService.updateJoborderData(item._id, body).then((resdoc) => {
      // this.joborderService
      //   .getJoborderDataList(this.page.offset, this.page.limit, this.keyword)
      //   .then((res: any) => {
      //     this.rows = res.data;
      //     this.formatMoment();
      //     this.sortRows();
      //     if (status === "serviceprepared") {
      //       console.log(resdoc);
      //       this.downloadAsPDF(resdoc);
      //     }
      //   });
      this.reloadData();
      if (status === "serviceprepared") {
        console.log(resdoc);
        this.downloadAsPDF(resdoc);
      }
    });
  }

  deleteData(item) {
    const body = {
      title: "กรุณายืนยันการ ลบรายการ",
      message: "ใบงานเลขที่ : " + item.docno,
    };

    this.dialogConfirmService.show(body).then(async (result) => {
      if (result) {
        this.spinner.show();
        this.joborderService
          .deleteJoborderData(item)
          .then((res) => {
            this._snackBar.open("ลบใบสั่งงานเสร็จสิ้น", "", {
              duration: 5000,
            });
            // this.joborderService
            //   .getJoborderDataList(
            //     this.page.offset,
            //     this.page.limit,
            //     this.keyword
            //   )
            //   .then((res: any) => {
            //     this.rows = res.data;
            //     this.formatMoment();
            //     // this.sortRows();
            //     this.spinner.hide();
            //   });
            this.reloadData();
          })
          .catch((res) => {
            this._snackBar.open("การลบผิดพลาด กรุณาลองใหม่ภายหลัง", "", {
              duration: 5000,
            });
          });
      }
    });
  }

  updateFilter(event) {
    this.keyword = event.target.value;
    this.reloadData();
    this.page.offset = 0;
    // const val = event.target.value.toLowerCase();

    // console.log(val);

    // // filter our data
    // const temp = this.temp.filter(function (d) {
    //   return (
    //     d.docno.toLowerCase().indexOf(val) !== -1 ||
    //     d.carNo.toLowerCase().indexOf(val) !== -1 ||
    //     !val
    //   );
    // });

    // console.log(temp);
    // // update the rows
    // this.rows = temp;
  }

  downloadAsPDF(data: any) {
    const doc = new jsPDF();

    let a = doc.getFontList();
    console.log(a);
    doc.setFont("THSarabun");
    doc.setFontType("normal");
    // doc.setFontType("bold");
    doc.setFontSize(18);

    console.log(data);

    doc.text(150, 15, `เลขที่ : ${data.docno}`);

    doc.text(150, 25, `วันที่ : ${moment(data.docdate).format("DD/MM/YYYY")}`);

    doc.text(15, 35, `รถธรรมธุรกิจ ทะเบียนรถ : ${data.carNo.lisenceID}`);
    doc.text(15, 45, `ผู้ให้บริการ : ${data.carNo.driverInfo.displayName} [${data.carNo.driverInfo.mobileNo1}]`);

    doc.rect(15, 50, 180, 10);

    doc.text(25, 57, "ลำดับที่");
    doc.text(55, 57, "รายละเอียด");
    doc.text(145, 57, "ยอดขาย");
    let line = 67;
    for (let index = 0; index < data.contactLists.length; index++) {
      let contact: any = data.contactLists[index];
      let mno = `${contact.mobileNo1}`;
      if (line >= 257) {
        doc.addPage();
        line = 15;
      }
      doc.text(25, line, `${index + 1}.`);
      doc.text(
        45,
        line,
        `คุณ ${contact.firstName} ${contact.lastName} [ ${mno}]`
      );
      doc.text(
        45,
        line + 10,
        `${contact.addressLine1} ${contact.addressStreet}`
      );
      doc.text(
        45,
        line + 20,
        `${contact.addressSubDistrict} ${contact.addressDistrict} ${contact.addressProvince} ${contact.addressPostCode}`
      );
      let txtStatus = contact.contactStatus === "confirm" ? "ยืนยัน" : "ปฏิเสธ";
      doc.text(
        45, 
        line + 30,
        `สถานะ : ${txtStatus}`   
      );

      line += 43;
    }

    doc.save(`${data.docno}.pdf`);
  }
}
