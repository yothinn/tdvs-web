import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { Location } from "@angular/common";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";

import { VehicleService } from "../services/vehicle.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: "app-vehicle-form",
  templateUrl: "./vehicleForm.component.html",
  styleUrls: ["./vehicleForm.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleData: any = {};
  vehicleStaffData: Array<any> = [];
  temp: Array<any> = [];

  vehicleDetailData: Array<any> = [];
  tempVehicle: Array<any> = [];
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  async ngOnInit() {
    // this.vehicleService.getVehicleStaffList().subscribe((res: any) => {
    //   this.vehicleStaffData = res.data;
    //   this.temp = res.data;
    // });

    this.vehicleService.getVehicleDetailList().subscribe((res: any) => {
      this.vehicleDetailData = res.data;
      this.tempVehicle = res.data;
    });

    this.vehicleData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          lisenceID: "",
          startDate: "",
          endDate: "",
          driverInfo: {
            displayName: "",
          },
        };

    if (this.vehicleData._id) {
      // console.log("case Edit");
      this.vehicleForm = this.editForm();
    } else {
      // console.log("case New");
      this.vehicleForm = this.createForm();
    }
    let res: any = await this.vehicleService.getVehicleStaffList();
    this.vehicleStaffData = res.data;
    this.temp = res.data;

    let driverInfo: FormGroup = <FormGroup>(
      this.vehicleForm.controls["driverInfo"]
    );

    driverInfo.controls["displayName"].setValidators([
      Validators.required,
      this.valueSelected(this.vehicleStaffData),
    ]);
    //

    this.spinner.hide();
  }

  createForm(): FormGroup {
    let LISENCEID = /^[0-9ก-ฮ][ก-ฮ][ก-ฮ]? [0-9]{1,4}$/;
    return this.formBuilder.group({
      lisenceID: [
        this.vehicleData.lisenceID,
        [Validators.required, Validators.pattern(LISENCEID)],
      ],
      startDate: [this.vehicleData.startDate, Validators.required],
      endDate: [this.vehicleData.endDate, this.validDateEnd],
      driverInfo: this.driverInfoForm(),
    });
  }

  editForm(): FormGroup {
    let LISENCEID = /^[0-9ก-ฮ][ก-ฮ][ก-ฮ]? [0-9]{1,4}$/;
    return this.formBuilder.group({
      lisenceID: [
        this.vehicleData.lisenceID,
        [Validators.required, Validators.pattern(LISENCEID)],
      ],
      startDate: [this.vehicleData.startDate, Validators.required],
      endDate: [this.vehicleData.endDate, this.validDateEnd],
      driverInfo: this.driverInfoForm(),
    });
  }

  driverInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.vehicleData.driverInfo.title],
      firstName: [this.vehicleData.driverInfo.firstName],
      lastName: [this.vehicleData.driverInfo.displayName],
      displayName: [
        this.vehicleData.driverInfo.displayName,
        [Validators.required],
      ],
      persanalId: [this.vehicleData.driverInfo.persanalId],
      driverId: [this.vehicleData.driverInfo.driverId],
      mobileNo1: [this.vehicleData.driverInfo.mobileNo1],
      mobileNo2: [this.vehicleData.driverInfo.mobileNo2],
      mobileNo3: [this.vehicleData.driverInfo.mobileNo3],
      addressLine1: [this.vehicleData.driverInfo.addressLine1],
      addressStreet: [this.vehicleData.driverInfo.addressStreet],
      addressSubDistrict: [this.vehicleData.driverInfo.addressSubDistrict],
      addressDistrict: [this.vehicleData.driverInfo.addressDistrict],
      addressProvince: [this.vehicleData.driverInfo.addressProvince],
      addressPostCode: [this.vehicleData.driverInfo.addressPostCode],
      lineUserId: [this.vehicleData.driverInfo.lineUserId],
      latitude: [this.vehicleData.driverInfo.latitude],
      longitude: [this.vehicleData.driverInfo.longitude],
    });
  }

  updateFilterVehicleDetail(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const tempVehicle = this.tempVehicle.filter(function (d) {
      return d.lisenceID.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // console.log(tempVehicle);
    // update the rows
    this.vehicleDetailData = tempVehicle;
  }

  getVehicleDetailData(option) {
    // filter our data
    const tempVehicle: any = this.tempVehicle.filter(function (d) {
      return (
        d.lisenceID.toLowerCase().indexOf(option.value) !== -1 || !option.value
      );
    });
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.displayName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.vehicleStaffData = temp;
    // console.log(this.postcodes);
  }

  getVehicleStaff(option) {
    // filter our data
    const temp: any = this.temp.filter(function (d) {
      return (
        d.displayName.toLowerCase().indexOf(option.value.toLowerCase()) !== -1 ||
        !option.value
      );
    });
    let driverInfo: FormGroup = <FormGroup>(
      this.vehicleForm.controls["driverInfo"]
    );
    driverInfo.controls["title"].setValue(temp[0].title);
    driverInfo.controls["firstName"].setValue(temp[0].firstName);
    driverInfo.controls["lastName"].setValue(temp[0].lastName);
    driverInfo.controls["displayName"].setValue(temp[0].displayName);
    driverInfo.controls["persanalId"].setValue(temp[0].persanalId);
    driverInfo.controls["driverId"].setValue(temp[0].driverId);
    driverInfo.controls["mobileNo1"].setValue(temp[0].mobileNo1);
    driverInfo.controls["mobileNo2"].setValue(temp[0].mobileNo2);
    driverInfo.controls["mobileNo3"].setValue(temp[0].mobileNo3);
    driverInfo.controls["addressLine1"].setValue(temp[0].addressLine1);
    driverInfo.controls["addressStreet"].setValue(temp[0].addressStreet);
    driverInfo.controls["addressSubDistrict"].setValue(
      temp[0].addressSubDistrict
    );
    driverInfo.controls["addressDistrict"].setValue(temp[0].addressDistrict);
    driverInfo.controls["addressProvince"].setValue(temp[0].addressProvince);
    driverInfo.controls["addressPostCode"].setValue(temp[0].addressPostCode);
    driverInfo.controls["lineUserId"].setValue(temp[0].lineUserId);
    driverInfo.controls["latitude"].setValue(temp[0].latitude);
    driverInfo.controls["longitude"].setValue(temp[0].longitude);
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if(this.vehicleDetailData.length > 0){
      this.vehicleForm.value.vehicleType = this.vehicleDetailData[0].vehicleType;
      this.vehicleForm.value.vehicleColor = this.vehicleDetailData[0].vehicleColor;
      this.vehicleForm.value.vehicleBrand = this.vehicleDetailData[0].vehicleBrand;
      this.vehicleForm.value.isOwner = this.vehicleDetailData[0].isOwner;
      if(!this.vehicleDetailData[0].isOwner){
        this.vehicleForm.value.ownerInfo = this.vehicleDetailData[0].ownerInfo;
      }
     
    }
    if (this.vehicleData._id) {
      this.vehicleForm.value._id = this.vehicleData._id;
      this.vehicleService
        .updateVehicleData(this.vehicleForm.value)
        .then((res) => {
          // console.log(res);
          this.location.back();
        })
        .catch((err) => {
          this.spinner.hide();
          this.snackBar.open(err.error.message, "", {
            duration: 7000,
          });
        });
    } else {
      this.vehicleService
        .createVehicleData(this.vehicleForm.value)
        .then(() => {
          this.location.back();
        })
        .catch((err) => {
          this.spinner.hide();
          this.snackBar.open(err.error.message, "", {
            duration: 7000,
          });
        });
    }
  }

  validDateEnd(control: AbstractControl) {
    // console.log(control.value);
    if (!control.value) return null;
    let frmGroup: FormGroup = <FormGroup>control.parent;
    try {
      // console.log(new Date(frmGroup.controls["startDate"].value).getTime());
      if (
        new Date(control.value).getTime() <
        new Date(frmGroup.controls["startDate"].value).getTime()
      ) {
        // console.log("invalid");
        return { validDate: true };
      }
    } catch (error) {
      // TODO: throw error
    }

    return null;
  }

  valueSelected(myArray: any[]): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      let selectboxValue = c.value;
      // console.log(myArray);
      // console.log(selectboxValue)
      let pickedOrNot = myArray.filter((alias) => {
        return alias.displayName === selectboxValue;
      });
      // console.log(pickedOrNot.length);
      if (pickedOrNot.length > 0) {
        // everything's fine. return no error. therefore it's null.
        return null;
      } else {
        //there's no matching selectboxvalue selected. so return match error.
        return { match: true };
      }
    };
  }
}
