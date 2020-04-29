import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { Location } from "@angular/common";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";

import { VehicledataService } from "../services/vehicledata.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ValidatePID } from "./pid.validate";

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
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    this.vehicledataService.getPostcodesList().subscribe((res: any) => {
      this.postcodesList = res.data;
      this.temp = res.data;
    });

    this.vehicledataData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          lisenceID: "",
          vehicleType: "",
          vehicleColor: "",
          vehicleBrand: "",
          isOwner: false,
          ownerInfo: {
            title: "",
            firstName: "TuiLydfbN",
            lastName: "",
            displayName: "",
            isCompany: true,
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

    if(this.vehicledataData.ownerInfo.isCompany){
      this.ownerDataForm.controls["firstName"].setValidators(null);
      this.ownerDataForm.controls["lastName"].setValidators(null);
      this.ownerDataForm.controls["displayName"].setValidators([Validators.required]);
    }else{
      this.ownerDataForm.controls["firstName"].setValidators([Validators.required]);
      this.ownerDataForm.controls["lastName"].setValidators([Validators.required]);
      this.ownerDataForm.controls["displayName"].setValidators(null);
    }
    this.spinner.hide();
  }

  createVehicleForm(): FormGroup {
    return this.formBuilder.group({
      lisenceID: [this.vehicledataData.lisenceID, Validators.required],
      vehicleType: [this.vehicledataData.vehicleType, Validators.required],
      vehicleColor: [this.vehicledataData.vehicleColor, Validators.required],
      vehicleBrand: [this.vehicledataData.vehicleBrand, Validators.required],
      isOwner: [this.vehicledataData.isOwner, Validators.required],
    });
  }
  createOwnerDataForm(isOwner:boolean): FormGroup {
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
        // refId: [this.vehicledataData.ownerInfo.refId],
        // mobileNo1: [this.vehicledataData.ownerInfo.mobileNo1],
        // mobileNo2: [this.vehicledataData.ownerInfo.mobileNo2],
        // mobileNo3: [this.vehicledataData.ownerInfo.mobileNo3],
        // addressLine1: [this.vehicledataData.ownerInfo.addressLine1],
        // addressStreet: [this.vehicledataData.ownerInfo.addressStreet],
        // addressSubDistrict: [this.vehicledataData.ownerInfo.addressSubDistrict],
        // addressDistrict: [this.vehicledataData.ownerInfo.addressDistrict],
        // addressProvince: [this.vehicledataData.ownerInfo.addressProvince],
        // addressPostCode: [this.vehicledataData.ownerInfo.addressPostCode],
      });
    } else {
      console.log("supplier");
      return this.formBuilder.group({
        title: [this.vehicledataData.ownerInfo.title],
        firstName: [
          this.vehicledataData.ownerInfo.firstName
        ],
        lastName: [
          this.vehicledataData.ownerInfo.lastName
        ],
        displayName: [
          this.vehicledataData.ownerInfo.displayName
        ],
        isCompany: [this.vehicledataData.ownerInfo.isCompany],
        // refId: [this.vehicledataData.ownerInfo.refId, [ValidatePID]],
        // mobileNo1: [
        //   this.vehicledataData.ownerInfo.mobileNo1,
        //   [Validators.required, Validators.pattern(MOBILE_PATTERN)],
        // ],
        // mobileNo2: [this.vehicledataData.ownerInfo.mobileNo2],
        // mobileNo3: [this.vehicledataData.ownerInfo.mobileNo3],
        // addressLine1: [
        //   this.vehicledataData.ownerInfo.addressLine1,
        //   Validators.required,
        // ],
        // addressStreet: [
        //   this.vehicledataData.ownerInfo.addressStreet,
        //   Validators.required,
        // ],
        // addressSubDistrict: [
        //   this.vehicledataData.ownerInfo.addressSubDistrict,
        //   Validators.required,
        // ],
        // addressDistrict: [
        //   this.vehicledataData.ownerInfo.addressDistrict,
        //   Validators.required,
        // ],
        // addressProvince: [
        //   this.vehicledataData.ownerInfo.addressProvince,
        //   Validators.required,
        // ],
        // addressPostCode: [
        //   this.vehicledataData.ownerInfo.addressPostCode,
        //   [Validators.required, Validators.pattern(POSTCODE_PATTERN)],
        // ],
      });
    }
  }
  

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    // if (this.vehicledataData._id) {
    //   this.vehicledataForm.value._id = this.vehicledataData._id;
    //   this.vehicledataService
    //     .updateVehicledataData(this.vehicledataForm.value)
    //     .then((res) => {
    //       // console.log(res);
    //       this.location.back();
    //     })
    //     .catch((err) => {
    //       this.spinner.hide();
    //     });
    // } else {
    //   this.vehicledataService
    //     .createVehicledataData(this.vehicledataForm.value)
    //     .then(() => {
    //       this.location.back();
    //     })
    //     .catch((err) => {
    //       this.spinner.hide();
    //     });
    // }
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
    console.log(this.postcodesList);
  }

  getPosts(val) {
    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    // let viewValue = val.viewValue;
    // let arrValue = val.viewValue.split("|");
    // let subdistrict = arrValue[1].trim();
    // let district = arrValue[2].trim();
    // let province = arrValue[3].trim();
    // let ownerInfo: FormGroup = <FormGroup>(
    //   this.vehicledataForm.controls["ownerInfo"]
    // );
    // ownerInfo.controls["addressProvince"].setValue(province);
    // ownerInfo.controls["addressDistrict"].setValue(district);
    // ownerInfo.controls["addressSubDistrict"].setValue(subdistrict);
  }

  isOwnerChanged(e) {
    console.log(e);
    this.ownerDataForm = this.createOwnerDataForm(e.value);
  }
  isCompanyChanged(e) {
    console.log(e);
    if(e.value){
      this.ownerDataForm.controls["firstName"].setValidators(null);
      this.ownerDataForm.controls["lastName"].setValidators(null);
      this.ownerDataForm.controls["displayName"].setValidators([Validators.required]);
    }else{
      this.ownerDataForm.controls["firstName"].setValidators([Validators.required]);
      this.ownerDataForm.controls["lastName"].setValidators([Validators.required]);
      this.ownerDataForm.controls["displayName"].setValidators(null);
    }
  }
}
