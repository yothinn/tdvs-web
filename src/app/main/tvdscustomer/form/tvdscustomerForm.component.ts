import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { Location } from "@angular/common";
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidatorFn } from "@angular/forms";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";

import { TvdscustomerService } from "../services/tvdscustomer.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ValidatePID } from "app/share/validates/pid.validate";
import { MatSnackBar } from "@angular/material";
import { PostcodeService } from 'app/services/postcode.service';
import { validatePostCode } from 'app/share/validates/postcode.validate';

const POSTCODE_PATTERN = /^[0-9]{5,5}$/;
const MOBILE_PATTERN = /^[0-9]{10,10}$/;

@Component({
  selector: "app-tvdscustomer-form",
  templateUrl: "./tvdscustomerForm.component.html",
  styleUrls: ["./tvdscustomerForm.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class TvdscustomerFormComponent implements OnInit {
  tvdscustomerForm: FormGroup;
  tvdscustomerData: any = {};

  postcodeList: any = [];
  // temp = [];

  convenientDayList = [
    {
      weekDay: 3,
      displayDay: 'วันพุธ',
      selected: false
    },
    {
      weekDay: 4,
      displayDay: 'วันพฤหัสบดี',
      selected: false
    },
    {
      weekDay: 6,
      displayDay: 'วันเสาร์',
      selected: false
    },
    {
      weekDay: 0,
      displayDay: 'วันอาทิตย์',
      selected: false
    }
  ]


  title: Array<any> = [
    { value: "นาย", viewValue: "นาย" },
    { value: "นาง", viewValue: "นาง" },
    { value: "นางสาว", viewValue: "นางสาว" },
  ];

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private tvdscustomerService: TvdscustomerService,
    private postcodeService: PostcodeService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit() {

    this.postcodeList = this.route.snapshot.data.postcode;

    this.tvdscustomerData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          title: '',
          firstName: '',
          lastName: '',
          persanalId: '',
          mobileNo1: '',
          mobileNo2: '',
          mobileNo3: '',
          addressLine1: '',
          addressStreet: '',
          addressSubDistrict: '',
          addressDistrict: '',
          addressProvince: '',
          addressPostCode: '',
          notes: '',
          latitude: '',
          longitude: ''
        };
    this.tvdscustomerData.persanalId = this.tvdscustomerData.persanalId || '';
    this.tvdscustomerData.notes = this.tvdscustomerData.notes || '';

    this.initForm();

    this.convenientDayList.forEach(item => {
      item.selected = this.tvdscustomerData.convenientDay[item.weekDay] || false;
    });
 
    this.spinner.hide();
  }

  initForm(): void {
    this.tvdscustomerForm = this.formBuilder.group({
      title: [this.tvdscustomerData.title],
      firstName: [this.tvdscustomerData.firstName, Validators.required],
      lastName: [this.tvdscustomerData.lastName, Validators.required],
      persanalId: [this.tvdscustomerData.persanalId, [ValidatePID]],
      mobileNo1: [
        this.tvdscustomerData.mobileNo1,
        [Validators.required, Validators.pattern(MOBILE_PATTERN)],
      ],
      mobileNo2: [this.tvdscustomerData.mobileNo2],
      mobileNo3: [this.tvdscustomerData.mobileNo3],
      addressLine1: [this.tvdscustomerData.addressLine1, Validators.required],
      addressStreet: [this.tvdscustomerData.addressStreet],
      addressSubDistrict: [
        this.tvdscustomerData.addressSubDistrict,
        Validators.required,
      ],
      addressDistrict: [
        this.tvdscustomerData.addressDistrict,
        Validators.required,
      ],
      addressProvince: [
        this.tvdscustomerData.addressProvince,
        Validators.required,
      ],
      addressPostCode: [
        this.tvdscustomerData.addressPostCode,
        [ 
          Validators.required, 
          Validators.pattern(POSTCODE_PATTERN),
          validatePostCode(this.postcodeService.postcodeList)
        ],
      ],
      notes: [this.tvdscustomerData.notes],
      latitude: [this.tvdscustomerData.latitude],
      longitude: [this.tvdscustomerData.longitude],
    });
  }


  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    let updData;
    updData = this.tvdscustomerForm.value;
    updData['convenientDay'] = Array(7).fill(false);
    this.convenientDayList.forEach(item => updData.convenientDay[item.weekDay] = item.selected);
    
    // console.log(updData);
    
    if (this.tvdscustomerData._id) {
      // this.tvdscustomerForm.value._id = this.tvdscustomerData._id;
      updData._id = this.tvdscustomerData._id;
      this.tvdscustomerService
        .updateTvdscustomerData(updData)
        //.updateTvdscustomerData(this.tvdscustomerForm.value)
        .then((res) => {
          this.snackBar.open("บันทึกข้อมูลสำเร็จ", "", {
            duration: 7000,
          });
          this.location.back();
        })
        .catch((err) => {
          this.spinner.hide();
          this.snackBar.open(err.error.message, "", {
            duration: 7000,
          });
        });
    } else {
      this.tvdscustomerService
        .createTvdscustomerData(updData)
        // .createTvdscustomerData(this.tvdscustomerForm.value)
        .then(() => {
          this.snackBar.open("บันทึกข้อมูลสำเร็จ", "", {
            duration: 7000,
          });
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

  filterPostcode(event): void {
    this.postcodeList = this.postcodeService.filter(event.target.value);
  }

  // updateFilter(event) {
  //   //change search keyword to lower case
  //   const val = event.target.value.toLowerCase();

  //   // filter our data
  //   // and clear tmp -> move to service
  //   const temp = this.temp.filter(function (d) {
  //     return d.postcode.toLowerCase().indexOf(val) !== -1 || !val;
  //   });

  //   // update the rows
  //   this.postcodesList = temp;
  // }

  setPostcode(val) {
    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    // let viewValue = val.viewValue;
    const arrValue = val.viewValue.split('|');
    const subdistrict = arrValue[1].trim();
    const district = arrValue[2].trim();
    const province = arrValue[3].trim();

    this.tvdscustomerForm.controls['addressProvince'].setValue(province);
    this.tvdscustomerForm.controls['addressDistrict'].setValue(district);
    this.tvdscustomerForm.controls['addressSubDistrict'].setValue(subdistrict);
  }

}
