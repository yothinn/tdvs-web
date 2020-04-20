import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material';
import { CarAndDateComponent } from '../car-and-date/car-and-date.component';
import * as moment from 'moment';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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

  sideNaveOpened: Boolean = false;

  titleDate: any;
  nameDate: any;

  zoom: number = 10;
  lat: number = 13.6186285;
  lng: number = 100.5078163;

  infoWindowOpened = null;
  previous_info_window = null;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
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
      this.formatMoment(this.orderData.docdate);
      this.sideNaveOpened = true;
      this.zoom = 13;
      this.lat = Number(this.orderData.contactLists[0].contactAddress.latitude);
      this.lng = Number(this.orderData.contactLists[0].contactAddress.longitude);
    }

    this.getVehicleData();

    // this.orderService.setupSocketConnection();

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
        this.formatMoment(result.docdate);

        let docdate = {
          docdate: result.docdate
        };
        this.getMarkerData(docdate);
      } else {
        this.location.back();
      }
    });
  }

  formatMoment(date) {
    this.titleDate = moment(date).format("DD/MM/YYYY");
    this.nameDate = moment(date).format('dddd');
  }

  async getMarkerData(docdate) {
    // this.orderService.getMarkerDataList(docdate).then((res) => {
    //   this.markersData = res;
    //   // console.log(this.markersData);
    //   this.defaultIconMarkers();
    // });
    this.markersData = await this.orderService.getMarkerDataList(docdate);
    // this.defaultIconMarkers();
  }

  // defaultIconMarkers() {
  //   let bg = ""
  //   let label = ""

  //   for (let i = 0; i < this.markersData.length; i++) {
  //     const marker = this.markersData[i];
  //     label = this.checkSymbolMarkersDefault(marker.contactStatus);

  //     for (let j = 0; j < marker.membership.length; j++) {
  //       const member = marker.membership[j];
  //       // console.log(member.activity);
  //       if (member.activity === "shareholder") {
  //         bg = "167eff"; //สีน้ำเงิน
  //         break;
  //       } else {
  //         bg = "ff2a2a"; //สีแดง
  //       };
  //     };
  //     marker.icon = {
  //       url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
  //       scaledSize: {
  //         width: 34,
  //         height: 34
  //       }
  //     };
  //   };
  //   console.log(this.markersData);

  // }

  // checkSymbolMarkersDefault(contactStatus) {
  //   if (contactStatus === "waitapprove") {
  //     return "W"
  //   };
  //   if (contactStatus === "confirm") {
  //     return "C"
  //   };
  //   if (contactStatus === "reject") {
  //     return "R"
  //   };
  //   if (contactStatus === "select") {
  //     return "S"
  //   };
  //   if (contactStatus === "") {
  //     return ""
  //   };
  // }

  clickedInfoWindow(infoWindow) {
    if (this.previous_info_window == null)
      this.previous_info_window = infoWindow;
    else {
      this.infoWindowOpened = infoWindow;
      this.previous_info_window.close();
    };
    this.previous_info_window = infoWindow;
  }

  closeInfo() {
    if (this.previous_info_window != null) {
      this.previous_info_window.close()
    }
  }

  clickedMarker(item: any, index: number) {
    if (item.contactStatus === "") {
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
          "contactAddress": item.contactAddress,
          "membership": item.membership
        }

        this.orderData.contactLists.push(itemList);
        this.changeIconMarker(item, "S");
      }
      // console.log(this.orderData.contactLists);
      // console.log(this.orderData.contactLists.length);

      item.docno = this.orderData.docno;
      item.contactStatus = "S";
      this.closeInfo();

      if (this.orderData.contactLists.length > 0) {
        this.sideNaveOpened = true;
      };
    };
  }

  onDeleteList(index) {
    this.findOnMap(this.orderData.contactLists[index], "");
    this.orderData.contactLists.splice(index, 1);
    if (this.orderData.contactLists.length === 0) {
      this.sideNaveOpened = false;
    }
  }

  sendConFirm(contactListData) {
    // console.log(contactListData)
    for (let i = 0; i < contactListData.directContact.length; i++) {
      const direct = contactListData.directContact[i];
      if (direct.method === "lineUserId") {
        let body = {
          "to": direct.value,
          "messages": [
            {
              "type": "template",
              "altText": "this is a confirm template",
              "template": {
                "type": "confirm",
                "actions": [
                  {
                    "type": "message",
                    "label": "รับนัดหมาย",
                    "text": "รับนัดหมาย วัน" + this.nameDate + "ที่: " + this.titleDate + " เลขเอกสาร: " + this.orderData.docno
                  },
                  {
                    "type": "message",
                    "label": "ปฏิเสธ",
                    "text": "ปฏิเสธ วัน" + this.nameDate + "ที่: " + this.titleDate + " เลขเอกสาร: " + this.orderData.docno
                  }
                ],
                "text": "ตามที่ท่านได้ลงทะเบียนบริการกับ รถธรรมธุรกิจ ไว้ เรามีความยินดีที่จะนำสินค้า ข้าว ผัก ไข่ และผลิตภัณฑ์แปรรูปไปพบท่านในวัน" + this.nameDate + "ที่: " + this.titleDate + " กรุณากดยืนยันนัดหมาย การเดินทางไม่สามารถระบุเวลาที่แน่นอนได้ โดยเราจะติดต่อท่านอีกครั้งก่อนออกเดินทางไปยังที่นัดหมาย ขอบคุณครับ ธรรมธุรกิจ"
              }
            }
          ]
        };
        // console.log(body)
        this.orderService.sendConFirmData(body).then((res) => {
          // console.log(res)
        });

      };
    };

  }

  onChangeStatus(status, i) {
    if (status === "sendLine") {
      this.orderData.contactLists[i].contactStatus = "waitapprove";
      this.sendConFirm(this.orderData.contactLists[i]);
      this.onSave();
      this.findOnMap(this.orderData.contactLists[i], "W");
    };
    if (status === "confirm") {
      this.orderData.contactLists[i].contactStatus = "confirm";
      this.onSave();
      this.findOnMap(this.orderData.contactLists[i], "C");
    };
    if (status === "reject") {
      this.orderData.contactLists[i].contactStatus = "reject";
      this.onSave();
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

    //case DELETE
    if (txt === "") {
      markerItem.docno = "";
      markerItem.contactStatus = "";
    };

    for (let i = 0; i < markerItem.membership.length; i++) {
      const member = markerItem.membership[i];
      if (member.activity === "shareholder") {
        bg = "167eff"; //สีน้ำเงิน
        break;
      } else {
        bg = "ff2a2a"; //สีแดง
      };
    };
    markerItem.icon = {
      url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
      scaledSize: {
        width: 34,
        height: 34
      }
    };
  }

  navigateByItem(contactItem) {
    this.lat = Number(contactItem.contactAddress.latitude);
    this.lng = Number(contactItem.contactAddress.longitude);
  }

  goBack() {
    this.spinner.show();
    // this.location.back();
    this.router.navigateByUrl("/order");
  }

  async onSave() {
    this.spinner.show();

    // console.log(this.orderData)

    if (this.orderData._id) {
      this.orderService
        .updateOrderData(this.orderData._id, this.orderData)
        .then(res => {
          // console.log(res);
          // this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.orderService
        .createOrderData(this.orderData)
        .then((res) => {
          // console.log(res)
          let data = {
            "_id": res._id,
            "docno": res.docno,
            "docdate": res.docdate,
            "carNo": res.carNo,
            "cusAmount": res.cusAmount,
            "orderStatus": res.orderStatus,
            "contactLists": res.contactLists
          }
          this.orderData = data;
          if (res._id) {
            this.router.navigateByUrl("/order/orderForm/" + this.orderData._id);
          }
          // console.log(this.orderData);
          // this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }

  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(`${ event.previousIndex} to ${event.currentIndex}`);
    moveItemInArray(this.orderData.contactLists, event.previousIndex, event.currentIndex);
    console.log(this.orderData.contactLists);
  }

}
