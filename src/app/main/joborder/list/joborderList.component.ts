import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewChecked,
} from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionType, ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { MatSnackBar } from "@angular/material";
import { JoborderService } from "../services/joborder.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DialogConfirmService } from "app/dialog-confirm/service/dialog-confirm.service";
import { TH_ORDERSTATUS, TH_CONTACTSTATUS } from 'app/types/tvds-status'

import * as moment from "moment";
import * as jsPDF from "jspdf";



@Component({
  selector: "app-joborder-list",
  templateUrl: "./joborderList.component.html",
  styleUrls: ["./joborderList.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class JoborderListComponent implements OnInit, AfterViewChecked {
  @ViewChild("tableWrapper") tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;

  rows: Array<any> = null;
  temp = null;
  // columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company', sortable: false }];

  ColumnMode = ColumnMode;


  page = {
    limit: 10,
    count: 0,
    offset: 0,
    orderBy: 'created',
    orderDir: 'desc'
  };
  keyword = '';

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
    if (this.rows) {
      this.temp = this.route.snapshot.data.items.data;
      this.page.count = this.route.snapshot.data.items.totalCount;
    }

    // console.log(this.rows);
    // this.formatMoment();
    // this.sortRows();
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

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.reloadData();
  }

  sortCallback(sortInfo: {
    sorts: { dir: string; prop: string }[];
    column: {};
    prevValue: string;
    newValue: string;
  }) {
    // there will always be one "sort" object if "sortType" is set to "single"
    // console.log(sortInfo);
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
    // this.formatMoment();
  }

  // formatMoment() {
  //   for (let i = 0; i < this.rows.length; i++) {
  //     const row = this.rows[i];
  //     row.docdate = moment(row.docdate).format("DD/MM/YYYY");
  //     // row.docdate = moment(row.docdate).format();
  //   }
  // }

  sortRows() {
    this.rows.reverse();
  }

  addData(): void {
    this.router.navigate(['/joborder/joborderForm/new']);
  }

  editData(item): void {
    this.router.navigate(['/joborder/joborderForm', item._id]);
  }

  changeStatusData(item, status) {
    // console.log(item);
    let body = {
      orderStatus: status,
    };
    if (status === "serviceprepared") {
      if(item.orderStatus === "orderavailable"){
        this.joborderService.updateJoborderData(item._id, body).then((resdoc) => {
          this.reloadData();
          this.joborderService.downloadAsPDF(resdoc, `${resdoc.docno}.pdf`);
        });
      }else{
        body = {
          orderStatus: item.orderStatus
        }
        this.joborderService.updateJoborderData(item._id, body).then((resdoc) => {
          this.reloadData();
          this.joborderService.downloadAsPDF(resdoc, `${resdoc.docno}.pdf`);
        });
      }
    } else {
      this.joborderService.updateJoborderData(item._id, body).then((resdoc) => {
        this.reloadData();
      });
    }
    
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

  onSelect(event) {
    // console.log(event);
  }

  onJoborderReport(row): void {
    this.router.navigate(['report/joborder', row._id]);
  }

  // Move to service
  // downloadAsPDF(data: any) {
  //   const doc = new jsPDF();
  //   // Line position
  //   const lineSpace = 8;
  //   let line = 15;

  //   // Format Number
  //   const nFormat = Intl.NumberFormat('en-GB', {minimumFractionDigits: 2});

  //   // total sales
  //   let salesAmount = 0;

  //   // let a = doc.getFontList();
  //   // console.log(a);
  //   doc.setFont('THSarabun');
  //   doc.setFontType('normal');
  //   // doc.setFontType("bold");
  //   doc.setFontSize(16);

  //   // console.log(data);  
    
  //   // Header
  //   doc.text(
  //     15,
  //     line,
  //     `วันที่พิมพ์ : ${moment(Date.now()).format('DD/MM/YYYY HH:MM:SS')}`
  //   );
  //   doc.text(140, line, `เลขที่ : ${data.docno}`);

  //   line += lineSpace;
  //   doc.text(15, line, `รถธรรมธุรกิจ ทะเบียนรถ : ${data.carNo.lisenceID}`);
  //   doc.text(140, line, `วันที่ : ${moment(data.docdate).format('DD/MM/YYYY')}`);

  //   line += lineSpace;
  //   doc.text(
  //     15,
  //     line,
  //     `ผู้ให้บริการ : ${data.carNo.driverInfo.displayName} [${data.carNo.driverInfo.mobileNo1}]`
  //   );
  //   doc.text(140, line, `สถานะใบงาน: ${TH_ORDERSTATUS[data.orderStatus]}`);

  //   // Table Header
  //   line += 10;
  //   doc.rect(15, line, 180, 10);
  //   line += 7;
  //   doc.text(20, line, 'ลำดับที่');
  //   doc.text(55, line, 'รายละเอียด');
  //   doc.text(155, line, 'ยอดขาย');

  //   // Description contact
  //   line += lineSpace + 2;
  //   for (let index = 0; index < data.contactLists.length; index++) {
  //     const contact: any = data.contactLists[index];

  //     // Do not print customer that reject
  //     if (contact.contactStatus === 'reject') {
  //       continue;
  //     }

  //     // let mno = `${contact.mobileNo1}`;
  //     // Add new Page
  //     if (line >= 257) {
  //       doc.addPage();
  //       line = 15;
  //     }

  //     doc.text(23, line, `${index + 1}.`);
  //     doc.text(40, line, `คุณ ${contact.firstName} ${contact.lastName} [ ${contact.mobileNo1}]`);

  //     // print only sales is not equal zero
  //     const sales: number = contact.sales ? contact.sales : 0;
  //     if (sales !== 0) {
  //       salesAmount += sales;
  //       doc.text(155, line, nFormat.format(sales));
  //     }

  //     line += lineSpace;
  //     doc.text(40, line, `${contact.addressLine1} ${contact.addressStreet}`);
  //     line += lineSpace;
  //     doc.text(
  //       40,
  //       line,
  //       `${contact.addressSubDistrict} ${contact.addressDistrict} ${contact.addressProvince} ${contact.addressPostCode}`
  //     );

  //     line += lineSpace;
  //     doc.text(40, line, `สถานะ : ${TH_CONTACTSTATUS[contact.contactStatus]}`);

  //     line += lineSpace + 2;
  //   }

  //   // Sales Amount
  //   if (salesAmount !== 0) {
  //     line += lineSpace;
  //     doc.line(140, line - 7, 190, line - 7);

  //     doc.text(100, line, 'ยอดขายรวม');
  //     doc.text(155, line, nFormat.format(salesAmount));

  //     doc.line(140, line + 5, 190, line + 5);
  //     doc.line(140, line + 6, 190, line + 6);
  //   }
    
  //   doc.save(`${data.docno}.pdf`);
  // }

  // Move to json type in tvds-status
  // /**
  //  * convert contact status to thai string status
  //  * @param {string} status : contact status
  //  * @returns {string} thai contact status
  //  */
  // strContactStatus(status): string {
  //   switch (status) {
  //     case "select": return "เลือก";
  //     case "waitapprove": return "รอยืนยัน";
  //     case "waitcontact": return "รอยืนยัน";
  //     case "confirm": return "ยืนยัน";
  //     case "reject": return "ลูกค้ายกเลิก";
  //     case "arrival": return "ถึงจุดบริการ";
  //     case "departure": return "ออกเดินทาง";
  //     case "driver-reject": return "คนขับรถยกเลิก";
  //   }
  // }

  // Move to json type in tvds-status
  // /**
  //  * convert order status to thai text
  //  */
  // strOrderStatus(status): String {
  //   switch (status) {
  //     case "draft": return "จัดเส้นทาง";
  //     case "waitapprove": return "รอยืนยัน";
  //     case "orderavailable": return "ใบงานพร้อม";
  //     case "serviceprepared": return "เตรียมการบริการ";
  //     case "ordercancel": return "ยกเลิกใบงาน";
  //     case "golive": return "กำลังให้บริการ";
  //     case "close": return "จบบริการ";
  //     case "closewithcondition": return "จบบริการ(ยกเลิก)";
  //     default:
  //       return "ไม่มี";
  //   }
  // }
}
