import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { OrderService } from '../services/order.service';
import { InvolvedpartyService } from './../../involvedparty/services/involvedparty.service';
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
  vehicleData: Array<any> = [];
  markersData: Array<any> = [];

  sideNaveOpened: Boolean;

  zoom: number = 10;
  lat: number = 13.6186285;
  lng: number = 100.5078163;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private orderService: OrderService,
    private involvedpartyService: InvolvedpartyService,
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
        "orderStatus": "draft",
        "contactLists": []
      };
    console.log(this.orderData);
    if (this.orderData.contactLists.length > 0) {
      this.sideNaveOpened = true;
    }

    this.getVehicleData();
    this.getMarkerData();

  }

  getVehicleData() {
    this.orderService.getVehicleData().then((res) => {
      this.vehicleData = res;
      this.openCarAndDate();
      this.spinner.hide();
    }).catch((err) => {
      console.log(err);
      this.spinner.hide();
    })
  }

  openCarAndDate(): void {
    const dialogRef = this.dialog.open(CarAndDateComponent, {
      width: '350px',
      disableClose: true,
      data: { carNo: this.orderData.carNo, docdate: this.orderData.docdate, cars: this.vehicleData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderData.carNo = result.carNo
        this.orderData.docdate = result.docdate
      } else {
        this.location.back();
      }
    });
  }

  getMarkerData() {
    this.involvedpartyService.getInvolvedpartyDataList().subscribe((res: any) => {
      this.markersData = res.data;
      // console.log(this.markersData);
      this.defaultIconMarkers();
    });
  }

  defaultIconMarkers() {
    let bg = ""
    let label = ""

    this.markersData.forEach((el) => {
      if (el.relationType === "shareholder") {
        bg = "167eff"; //สีน้ำเงิน
      } else {
        bg = "ff2a2a"; //สีแดง
      }
      el.icon = {
        url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
        scaledSize: {
          width: 34,
          height: 34
        }
      }
    });
    // console.log(this.markersData);

    // let bg = "ff2a2a"; //167eff //blue
    // let label = ""

    // this.icon = {
    //   url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
    //   scaledSize: {
    //     width: 34,
    //     height: 34
    //   }
    // }
  }

  clickedMarker(item: any, index: number) {
    let mIndex = this.orderData.contactLists.findIndex((el) => {
      return el._id === item._id
    });
    // console.log(mIndex)

    if (mIndex === -1) {
      let itemList = {
        "_id": item._id,
        "contactStatus": "select",
        "personalInfo": item.personalInfo,
        "directContact": item.directContact,
        "contactAddress": item.contactAddress
      }

      this.orderData.contactLists.push(itemList);
      this.changeIconMarker(item, "S");
    }
    // console.log(this.orderData.contactLists);
    // console.log(this.orderData.contactLists.length);

    if (this.orderData.contactLists.length > 0) {
      this.sideNaveOpened = true;
    };
  }

  onDeleteList(index) {
    this.findOnMap(this.orderData.contactLists[index], "");
    this.orderData.contactLists.splice(index, 1);
    if (this.orderData.contactLists.length === 0) {
      this.sideNaveOpened = false;
    }
  }

  onChangeStatus(status, i) {
    if (status === "sendLine") {
      this.orderData.contactLists[i].contactStatus = "waitapprove";
      this.findOnMap(this.orderData.contactLists[i], "W");
    };
    if (status === "confirm") {
      this.orderData.contactLists[i].contactStatus = "confirm";
      this.findOnMap(this.orderData.contactLists[i], "C");
    };
    if (status === "reject") {
      this.orderData.contactLists[i].contactStatus = "reject";
      this.findOnMap(this.orderData.contactLists[i], "R");
    };
  }

  findOnMap(orderDataItem, txt) {
    // console.log(item._id)
    // console.log(this.markersData)

    let mIndex = this.markersData.findIndex((el) => {
      return el._id === orderDataItem._id
    });
    // console.log(this.markersData[mIndex])
    this.changeIconMarker(this.markersData[mIndex], txt);
  }

  changeIconMarker(markerItem, txt) {
    // console.log(markerItem)
    let bg = ""
    let label = txt
    if (markerItem.relationType === "shareholder") {
      bg = "167eff"; //สีน้ำเงิน
    } else {
      bg = "ff2a2a"; //สีแดง
    }
    markerItem.icon = {
      url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
      scaledSize: {
        width: 34,
        height: 34
      }
    }
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
