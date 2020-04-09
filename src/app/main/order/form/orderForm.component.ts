import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { CarAndDateComponent } from '../car-and-date/car-and-date.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './orderForm.component.html',
  styleUrls: ['./orderForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OrderFormComponent implements OnInit {

  orderData: any = {};

  markers: Array<any> = [];

  zoom: number = 10;
  lat: number = 13.6186285;
  lng: number = 100.5078163;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.orderData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        "docno": "",
        "docdate": "",
        "carNo": "",
        "cusAmount": null,
        "orderStatus": "draft"
      };

    console.log(this.orderData);

    this.spinner.hide();

    setTimeout(() => {
      this.openCarAndDate();
    });

    this.getMarkerData();
  }

  openCarAndDate(): void {
    const dialogRef = this.dialog.open(CarAndDateComponent, {
      width: '350px',
      disableClose: true,
      data: { carNo: this.orderData.carNo, docdate: this.orderData.docdate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderData.carNo = result.carNo
        this.orderData.docdate = result.docdate
      }
    });
  }

  getMarkerData() {
    this.markers = [
      { "lat": 13.75327751893923, "lng": 100.64047617858176, "label": null, "draggable": false },
      { "lat": 13.843966242828646, "lng": 100.63635630553489, "label": null, "draggable": false },
      { "lat": 13.76661630540836, "lng": 100.67480845397239, "label": null, "draggable": false },
      { "lat": 13.70658578493252, "lng": 100.60065073912864, "label": null, "draggable": false },
      { "lat": 13.717259000672662, "lng": 100.68167490905051, "label": null, "draggable": false },
      { "lat": 13.794275321937924, "lng": 100.63498301451926, "label": null, "draggable": false },
      { "lat": 13.758930056124933, "lng": 100.58966441100364, "label": null, "draggable": false }
    ]
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    console.log(this.orderData)

    if (this.orderData._id) {
      this.orderService
        .updateOrderData(this.orderData._id, this.orderData)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.orderService
        .createOrderData(this.orderData)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }

  }


}
