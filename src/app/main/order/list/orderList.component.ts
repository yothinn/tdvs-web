import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { OrderService } from "../services/order.service";
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from "moment";
import jsPDF from "jspdf";

@Component({
  selector: "app-order-list",
  templateUrl: "./orderList.component.html",
  styleUrls: ["./orderList.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OrderListComponent implements OnInit {
  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    console.log(this.rows);
    this.formatMoment();
    this.sortRows();
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
    this.router.navigateByUrl("/order/orderForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/order/orderForm/" + item._id);
  }

  changeStatusData(item, status) {
    // console.log(item);
    let body = {
      orderStatus: status,
    };
    this.orderService.updateOrderData(item._id, body).then((resdoc) => {
      this.orderService.getOrderDataList().subscribe((res: any) => {
        this.rows = res.data;
        this.formatMoment();
        if (status === "golive") {
          console.log(resdoc);
          this.downloadAsPDF(resdoc);
        }
      });
    });
  }

  deleteData(item) {
    this.orderService.deleteOrderData(item).then((res) => {
      this.orderService.getOrderDataList().subscribe((res: any) => {
        this.rows = res.data;
        this.formatMoment();
      });
    });
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return (
        d.docno.toLowerCase().indexOf(val) !== -1 ||
        d.carNo.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });

    // update the rows
    this.rows = temp;
  }

  downloadAsPDF(data: any) {
    const doc = new jsPDF();

    let a = doc.getFontList();
    console.log(a);
    doc.setFont("THSarabun");
    doc.setFontType("normal");
    // doc.setFontType("bold");
    doc.setFontSize(18);

    doc.text(150, 15, `เลขที่ : ${data.docno}`);

    doc.text(150, 25, `วันที่ : ${moment(data.docdate).format("DD/MM/YYYY")}`);

    doc.text(15, 35, `รถธรรมธุรกิจ : ${data.carNo}`);

    doc.rect(15, 40, 180, 10);

    doc.text(25, 47, "ลำดับที่");
    doc.text(55, 47, "รายละเอียด");
    let line = 57;
    for (let index = 0; index < data.contactLists.length; index++) {
      let contact: any = data.contactLists[index];
      let mno = "";
      contact.directContact.forEach(ch => {
        if(ch.method === "mobile"){
          mno += ch.value + " ";
        }
      });
      if (line >= 257) {
        doc.addPage();
        line = 15;
      }
      doc.text(25, line, `${index + 1}.`);
      doc.text(
        45,
        line,
        `คุณ ${contact.personalInfo.firstNameThai} ${contact.personalInfo.lastNameThai} [ ${mno}]`
      );
      doc.text(45, line + 10, `${contact.contactAddress.addressLine1} ${contact.contactAddress.addressStreet}`);
      doc.text(45, line + 20, `${contact.contactAddress.addressSubDistrict} ${contact.contactAddress.addressDistrict} ${contact.contactAddress.addressProvince} ${contact.contactAddress.addressPostalCode}`);
      
      line += 33;
    }

    doc.save(`${data.docno}.pdf`);
  }
}
