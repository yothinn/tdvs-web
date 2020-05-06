import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { Location } from "@angular/common";
import {
  FormGroup,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";

import { VehicledataService } from "../services/vehicledata.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ValidatePID } from "./pid.validate";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-vehicledata-form",
  templateUrl: "./vehicledataForm.component.html",
  styleUrls: ["./vehicledataForm.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VehicledataFormComponent implements OnInit {
  vehicleDataForm: FormGroup;
  ownerDataForm: FormGroup;
  vehicledataData: any = {};
  postcodesList: any = [];
  temp = [];

  isOwner: any[] = [
    { name: "รถบริษัท ธรรมธุรกิจ วิสาหกิจเพื่อสังคม จำกัด", value: true },
    { name: "รถร่วมบริการ", value: false },
  ];

  isCompany: any[] = [
    { name: "บุคคลธรรมดา", value: false },
    { name: "นิติบุคคล", value: true },
  ];

  vehicleType: Array<any> = [
    { value: "กระบะ ตอนเดียว", viewValue: "กระบะ ตอนเดียว" },
    { value: "กระบะ แคป", viewValue: "กระบะ แคป" },
    { value: "กระบะ 4 ประตู", viewValue: "กระบะ 4 ประตู" },
    { value: "อื่น ๆ", viewValue: "อื่น ๆ" },
  ];

  vehicleBrand: Array<any> = [
    { value: "โตโยต้า", viewValue: "โตโยต้า" },
    { value: "อีซูซุ", viewValue: "อีซูซุ" },
    { value: "ฟอร์ด", viewValue: "ฟอร์ด" },
    { value: "มาสด้า", viewValue: "มาสด้า" },
    { value: "มิตซูบิชิ", viewValue: "มิตซูบิชิ" },
    { value: "นิสสัน", viewValue: "นิสสัน" },
    { value: "เชฟโรเลต", viewValue: "เชฟโรเลต" },
    { value: "อื่น ๆ", viewValue: "อื่น ๆ" },
  ];

  vehicleColor: Array<any> = [
    { value: "สีดำ", viewValue: "สีดำ" },
    { value: "สีขาว", viewValue: "สีขาว" },
    { value: "สีแดง", viewValue: "สีแดง" },
    { value: "สีน้ำเงิน", viewValue: "สีน้ำเงิน" },
    { value: "สีบอลเงิน", viewValue: "สีบอลเงิน" },
    { value: "สีอื่น ๆ", viewValue: "สีอื่น ๆ" },
  ];

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private vehicledataService: VehicledataService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  async ngOnInit() {
    this.vehicledataData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          lisenceID: "",
          vehicleType: "",
          vehicleColor: "",
          vehicleBrand: "",
          isOwner: true,
          ownerInfo: {
            title: "",
            firstName: "",
            lastName: "",
            displayName: "",
            isCompany: false,
            refId: "",
            mobileNo1: "",
            mobileNo2: "",
            mobileNo3: "",
            addressLine1: "",
            addressStreet: "",
            addressSubDistrict: "",
            addressDistrict: "",
            addressProvince: "",
            addressPostCode: "",
          },
        };

    this.vehicleDataForm = this.createVehicleForm();
    this.ownerDataForm = this.createOwnerDataForm(this.vehicledataData.isOwner);

    if (this.vehicledataData.ownerInfo.isCompany) {
      this.ownerDataForm.controls["firstName"].setValidators(null);
      this.ownerDataForm.controls["lastName"].setValidators(null);
      this.ownerDataForm.controls["displayName"].setValidators([
        Validators.required,
      ]);
    } else {
      this.ownerDataForm.controls["firstName"].setValidators([
        Validators.required,
      ]);
      this.ownerDataForm.controls["lastName"].setValidators([
        Validators.required,
      ]);
      this.ownerDataForm.controls["displayName"].setValidators(null);
    }
    
    let res: any = await this.vehicledataService.getPostcodesList();
    this.postcodesList = res.data;
    this.temp = res.data;

    this.ownerDataForm.controls["addressPostCode"].setValidators([
      Validators.required,
      this.validatePostCode(this.postcodesList),
    ]);

    this.spinner.hide();
  }

  createVehicleForm(): FormGroup {
    let LISENCEID = /^[0-9ก-ฮ][ก-ฮ][ก-ฮ]? [0-9]{1,4}$/;
    return this.formBuilder.group({
      lisenceID: [
        this.vehicledataData.lisenceID,
        [Validators.required, Validators.pattern(LISENCEID)],
      ],
      vehicleType: [this.vehicledataData.vehicleType, Validators.required],
      vehicleColor: [this.vehicledataData.vehicleColor, Validators.required],
      vehicleBrand: [this.vehicledataData.vehicleBrand, Validators.required],
      isOwner: [this.vehicledataData.isOwner, Validators.required],
    });
  }
  createOwnerDataForm(isOwner: boolean): FormGroup {
    let POSTCODE_PATTERN = /^[0-9]{5,5}$/;
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;

    if (isOwner) {
      console.log("owner");
      return this.formBuilder.group({
        title: [this.vehicledataData.ownerInfo.title],
        firstName: [this.vehicledataData.ownerInfo.firstName],
        lastName: [this.vehicledataData.ownerInfo.lastName],
        displayName: [this.vehicledataData.ownerInfo.displayName],
        isCompany: [this.vehicledataData.ownerInfo.isCompany],
        refId: [this.vehicledataData.ownerInfo.refId],
        mobileNo1: [this.vehicledataData.ownerInfo.mobileNo1],
        mobileNo2: [this.vehicledataData.ownerInfo.mobileNo2],
        mobileNo3: [this.vehicledataData.ownerInfo.mobileNo3],
        addressLine1: [this.vehicledataData.ownerInfo.addressLine1],
        addressStreet: [this.vehicledataData.ownerInfo.addressStreet],
        addressSubDistrict: [this.vehicledataData.ownerInfo.addressSubDistrict],
        addressDistrict: [this.vehicledataData.ownerInfo.addressDistrict],
        addressProvince: [this.vehicledataData.ownerInfo.addressProvince],
        addressPostCode: [this.vehicledataData.ownerInfo.addressPostCode],
      });
    } else {
      console.log("supplier");
      return this.formBuilder.group({
        title: [this.vehicledataData.ownerInfo.title],
        firstName: [this.vehicledataData.ownerInfo.firstName],
        lastName: [this.vehicledataData.ownerInfo.lastName],
        displayName: [this.vehicledataData.ownerInfo.displayName],
        isCompany: [this.vehicledataData.ownerInfo.isCompany],
        refId: [this.vehicledataData.ownerInfo.refId, [ValidatePID]],
        mobileNo1: [
          this.vehicledataData.ownerInfo.mobileNo1,
          [Validators.required, Validators.pattern(MOBILE_PATTERN)],
        ],
        mobileNo2: [this.vehicledataData.ownerInfo.mobileNo2],
        mobileNo3: [this.vehicledataData.ownerInfo.mobileNo3],
        addressLine1: [
          this.vehicledataData.ownerInfo.addressLine1,
          Validators.required,
        ],
        addressStreet: [
          this.vehicledataData.ownerInfo.addressStreet,
          Validators.required,
        ],
        addressSubDistrict: [
          this.vehicledataData.ownerInfo.addressSubDistrict,
          Validators.required,
        ],
        addressDistrict: [
          this.vehicledataData.ownerInfo.addressDistrict,
          Validators.required,
        ],
        addressProvince: [
          this.vehicledataData.ownerInfo.addressProvince,
          Validators.required,
        ],
        addressPostCode: [
          this.vehicledataData.ownerInfo.addressPostCode,
          [Validators.required, Validators.pattern(POSTCODE_PATTERN)],
        ],
      });
    }
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    let body: any = this.vehicleDataForm.value;
    body.ownerInfo = this.ownerDataForm.value;

    if (this.vehicledataData._id) {
      this.vehicleDataForm.value._id = this.vehicledataData._id;
      this.vehicledataService
        .updateVehicledataData(body)
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
      this.vehicledataService
        .createVehicledataData(body)
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

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.postcode.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.postcodesList = temp;
  }

  getPosts(val) {
    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    let viewValue = val.viewValue;
    let arrValue = val.viewValue.split("|");
    let subdistrict = arrValue[1].trim();
    let district = arrValue[2].trim();
    let province = arrValue[3].trim();

    this.ownerDataForm.controls["addressProvince"].setValue(province);
    this.ownerDataForm.controls["addressDistrict"].setValue(district);
    this.ownerDataForm.controls["addressSubDistrict"].setValue(subdistrict);
  }

  isOwnerChanged(e) {
    console.log(e);
    this.ownerDataForm = this.createOwnerDataForm(e.value);
  }
  isCompanyChanged(e) {
    console.log(e);
    if (e.value) {
      this.ownerDataForm.controls["firstName"].setValidators(null);
      this.ownerDataForm.controls["lastName"].setValidators(null);
      this.ownerDataForm.controls["displayName"].setValidators([
        Validators.required,
      ]);

      this.ownerDataForm.controls["firstName"].setValue("");
      this.ownerDataForm.controls["lastName"].setValue("");
    } else {
      this.ownerDataForm.controls["firstName"].setValidators([
        Validators.required,
      ]);
      this.ownerDataForm.controls["lastName"].setValidators([
        Validators.required,
      ]);
      this.ownerDataForm.controls["displayName"].setValidators(null);

      this.ownerDataForm.controls["displayName"].setValue("");
    }
  }

  validatePostCode(myArray: any[]): ValidatorFn {
    if (myArray.length === 0) return null;
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      let selectboxValue = c.value;
      console.log(myArray);
      console.log(selectboxValue);
      let pickedOrNot = myArray.filter((alias) => {
        return alias.postcode === selectboxValue;
      });
      console.log(pickedOrNot.length);
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
