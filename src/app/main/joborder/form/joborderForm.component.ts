import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { JoborderService } from '../services/joborder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Socket } from "ng-socket-io";
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { SelectCarAndDateComponent } from '../select-car-and-date/select-car-and-date.component';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";


@Component({
  selector: 'app-joborder-form',
  templateUrl: './joborderForm.component.html',
  styleUrls: ['./joborderForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class JoborderFormComponent implements OnInit {

  joborderData: any = {};
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
    private formBuilder: FormBuilder,
    private joborderService: JoborderService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private socket: Socket,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.joborderData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        docno: "",
        docdate: "",
        carNo: "",
        cusAmount: null,
        orderStatus: "draft",
        contactLists: [],
      };
    console.log(this.joborderData);

    if (this.joborderData.contactLists.length > 0) {
      this.formatMoment(this.joborderData.docdate);
      this.sideNaveOpened = true;
      this.zoom = 13;
      this.lat = Number(this.joborderData.contactLists[0].latitude);
      this.lng = Number(this.joborderData.contactLists[0].longitude);
    }

    this.getVehicleData();

    this.socket.on("user-confirm-reject", (message: any) => {
      console.log(message);
      if (message.docno === this.joborderData.docno) {
        this.joborderData = message;
      }
    });

    this.spinner.hide();
  }

  getVehicleData() {
    this.joborderService.getVehicleData().then((res) => {
      this.vehicleData = res;
      this.openCarAndDate();
      this.spinner.hide();
    }).catch((err) => {
      console.log(err);
      this.spinner.hide();
    });
  }

  openCarAndDate(): void {
    const dialogRef = this.dialog.open(SelectCarAndDateComponent, {
      width: "350px",
      disableClose: true,
      data: {
        carNo: this.joborderData.carNo,
        docdate: this.joborderData.docdate,
        cars: this.vehicleData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.joborderData.carNo = result.carNo;
        this.joborderData.docdate = result.docdate;
        this.formatMoment(result.docdate);
        // console.log(this.joborderData);

        let docdate = {
          docdate: result.docdate,
        };
        this.getMarkerData(docdate);
      } else {
        this.router.navigateByUrl("/joborder");
      }
    });
  }

  formatMoment(date) {
    this.titleDate = moment(date).format("DD/MM/YYYY");
    this.nameDate = moment(date).format("dddd");
  }

  async getMarkerData(docdate) {
    this.markersData = await this.joborderService.getMarkerDataList(docdate);
    console.log(this.markersData);
    this.spinner.hide();
  }

  clickedInfoWindow(infoWindow) {
    if (this.previous_info_window == null)
      this.previous_info_window = infoWindow;
    else {
      this.infoWindowOpened = infoWindow;
      this.previous_info_window.close();
    }
    this.previous_info_window = infoWindow;
  }

  closeInfo() {
    if (this.previous_info_window != null) {
      this.previous_info_window.close();
    }
  }

  clickedMarker(item: any, index: number) {
    if (item.contactStatus === "") {
      let mIndex = this.joborderData.contactLists.findIndex((el) => {
        return el._id === item._id;
      });
      // console.log(mIndex)
      // console.log(item)
      let defualtStatus = "select"

      if (!item.lineUserId) {
        defualtStatus = "waitcontact"
      }

      if (mIndex === -1) {
        let itemList = {
          _id: item._id,
          contactStatus: defualtStatus,
          title: item.title,
          firstName: item.firstName,
          lastName: item.lastName,
          displayName: item.displayName,
          persanalId: item.persanalId,
          isShareHolder: item.isShareHolder,
          mobileNo1: item.mobileNo1,
          mobileNo2: item.mobileNo2,
          mobileNo3: item.mobileNo3,
          addressLine1: item.addressLine1,
          addressStreet: item.addressStreet,
          addressSubDistrict: item.addressSubDistrict,
          addressDistrict: item.addressDistrict,
          addressProvince: item.addressProvince,
          addressPostCode: item.addressPostCode,
          lineUserId: item.lineUserId,
          latitude: item.latitude,
          longitude: item.longitude
        };
        // console.log(itemList)

        this.joborderData.contactLists.push(itemList);
        this.changeIconMarker(item, "S");
      }
      // console.log(this.joborderData.contactLists);

      item.docno = this.joborderData.docno;
      item.contactStatus = "S";
      this.closeInfo();

      if (this.joborderData.contactLists.length > 0) {
        this.sideNaveOpened = true;
      }
    }
  }

  onDeleteList(index) {
    this.findOnMap(this.joborderData.contactLists[index], "");
    this.joborderData.contactLists.splice(index, 1);
    if (this.joborderData.contactLists.length === 0) {
      this.sideNaveOpened = false;
    }
  }

  onChangeStatus(status, i) {
    if (status === "sendLine") {
      this.joborderData.contactLists[i].contactStatus = "waitapprove";
      this.sendConFirm(this.joborderData.contactLists[i]);
      this.onSaveStatus("w");
      this.findOnMap(this.joborderData.contactLists[i], "W");
    }
    if (status === "confirm") {
      this.joborderData.contactLists[i].contactStatus = "confirm";
      this.onSaveStatus("c");
      this.findOnMap(this.joborderData.contactLists[i], "C");
    }
    if (status === "reject") {
      this.joborderData.contactLists[i].contactStatus = "reject";
      this.onSaveStatus("r");
      this.findOnMap(this.joborderData.contactLists[i], "R");
    }
  }

  onSaveStatus(txt) {
    this.joborderService.updateJoborderData(this.joborderData._id, this.joborderData).then(res => {
      this.joborderData = res;

      if (txt === "c" || txt === "r") {
        this._snackBar.open("อัพเดทสถานะเรียบร้อย", "", {
          duration: 7000,
        });
      }
    }).catch((err) => {
      this._snackBar.open("อัพเดทสถานะไม่สำเร็จ โปรดลองใหม่", "", {
        duration: 7000,
      });
    })
  }

  findOnMap(jobOrderDataItem, txt) {
    // console.log(item._id)
    // console.log(this.markersData)

    let mIndex = this.markersData.findIndex((el) => {
      return el._id === jobOrderDataItem._id;
    });
    // console.log(this.markersData[mIndex])
    this.changeIconMarker(this.markersData[mIndex], txt);
  }

  changeIconMarker(markerItem, txt) {
    // console.log(markerItem)
    let bg = "ff2a2a";
    let label = txt;

    //case DELETE
    if (txt === "") {
      markerItem.docno = "";
      markerItem.contactStatus = "";
    }

    if (markerItem.isShareHolder) {
      bg = "167eff"; //สีน้ำเงิน
    }

    markerItem.icon = {
      url: `https://ui-avatars.com/api/?rounded=true&size=36&font-size=0.4&length=4&color=fff&background=${bg}&name=${label}`,
      scaledSize: {
        width: 34,
        height: 34,
      },
    };
  }

  navigateByItem(contactItem) {
    this.lat = Number(contactItem.latitude);
    this.lng = Number(contactItem.longitude);
  }

  sendConFirm(contactListData) {
    // console.log(contactListData)
    if (contactListData.lineUserId) {
      let body = {
        to: contactListData.lineUserId,
        messages: [
          {
            type: "template",
            altText: "this is a confirm template",
            template: {
              type: "confirm",
              actions: [
                {
                  type: "message",
                  label: "รับนัดหมาย",
                  text:
                    "รับนัดหมาย วัน" + this.nameDate + "ที่: " + this.titleDate + " เลขเอกสาร: " + this.joborderData.docno
                },
                {
                  type: "message",
                  label: "ปฏิเสธ",
                  text:
                    "ปฏิเสธ วัน" + this.nameDate + "ที่: " + this.titleDate + " เลขเอกสาร: " + this.joborderData.docno
                },
              ],
              text:
                "ตามที่ท่านได้ลงทะเบียนบริการกับ รถธรรมธุรกิจ ไว้ เรามีความยินดีที่จะนำสินค้า ข้าว ผัก ไข่ และผลิตภัณฑ์แปรรูปไปพบท่านในวัน" +
                this.nameDate + "ที่: " + this.titleDate +
                " กรุณากดยืนยันนัดหมาย การเดินทางไม่สามารถระบุเวลาที่แน่นอนได้ โดยเราจะติดต่อท่านอีกครั้งก่อนออกเดินทางไปยังที่นัดหมาย ขอบคุณครับ ธรรมธุรกิจ"
            }
          }
        ]
      };
      // console.log(body)
      this.joborderService.sendConFirmData(body).then((res) => {
        this._snackBar.open("ส่งข้อความสำเร็จ รอยืนยัน", "", {
          duration: 5000,
        });
      }).catch((error) => {
        this._snackBar.open("ส่งข้อความไม่สำเร็จ โปรดส่งใหม่", "", {
          duration: 5000,
        });
      })

    };


  }



  goBack() {
    this.spinner.show();
    // this.location.back();
    this.router.navigateByUrl("/joborder");
  }

  async onSave() {
    this.spinner.show();

    if (this.joborderData._id) {
      this.joborderService
        .updateJoborderData(this.joborderData._id, this.joborderData)
        .then(res => {
          // console.log(res);
          this.joborderData = res;

          this.spinner.hide();

          this._snackBar.open("บันทึกแล้ว", "", {
            duration: 7000,
          });
        })
        .catch(err => {
          this.spinner.hide();
          this._snackBar.open("บันทึกไม่สำเร็จ", "", {
            duration: 7000,
          });
        });
    } else {
      this.joborderService
        .createJoborderData(this.joborderData)
        .then((res) => {
          this.spinner.hide();

          let data = {
            _id: res._id,
            docno: res.docno,
            docdate: res.docdate,
            carNo: res.carNo,
            cusAmount: res.cusAmount,
            orderStatus: res.orderStatus,
            contactLists: res.contactLists,
          };
          this.joborderData = data;
          this._snackBar.open("สร้างเอกสารสำเร็จ", "", {
            duration: 7000,
          });
          if (this.joborderData._id) {
            this.router.navigateByUrl("/joborder/joborderForm/" + this.joborderData._id);
          }
        })
        .catch(err => {
          this.spinner.hide();
          this._snackBar.open("สร้างเอกสารไม่สำเร็จ โปรดลองใหม่", "", {
            duration: 7000,
          });
        });
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(`${event.previousIndex} to ${event.currentIndex}`);
    moveItemInArray(
      this.joborderData.contactLists,
      event.previousIndex,
      event.currentIndex
    );
    console.log(this.joborderData.contactLists);
  }


}
