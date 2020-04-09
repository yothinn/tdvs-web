import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { OrderService } from '../services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './orderList.component.html',
  styleUrls: ['./orderList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
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
    private spinner: NgxSpinnerService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    console.log(this.rows)
    this.formatMoment();
  }

  formatMoment() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      row.docdate = moment(row.docdate).format("DD/MM/YYYY");
      // row.docdate = moment(row.docdate).format();
    };
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
      "orderStatus": status
    };
    this.orderService.updateOrderData(item._id, body).then((res) => {
      this.orderService.getOrderDataList().subscribe((res: any) => {
        this.rows = res.data;
        this.formatMoment();
      })
    });
  }

  deleteData(item) {
    this.orderService.deleteOrderData(item).then((res) => {
      this.orderService.getOrderDataList().subscribe((res: any) => {
        this.rows = res.data;
        this.formatMoment();
      })
    })
  }

  updateFilter(event) {
    //change search keyword to lower case
    // const val = event.target.value.toLowerCase();

    // filter our data

  }

}
