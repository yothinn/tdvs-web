import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { InvolvedpartyService } from '../services/involvedparty.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-involvedparty-form',
  templateUrl: './involvedpartyForm.component.html',
  styleUrls: ['./involvedpartyForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InvolvedpartyFormComponent implements OnInit {
  involvedpartyForm: FormGroup;
  directContact: FormArray;
  membership: FormArray;
  involvedpartyData: any = {};
  temp = [];
  postcodes: any = [];

  zoom: number = 10;
  lat: number = 13.6186285;
  lng: number = 100.5078163;


  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private involvedpartyService: InvolvedpartyService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  title: Array<any> = [
    { value: 'นาย', viewValue: 'นาย' },
    { value: 'นาง', viewValue: 'นาง' },
    { value: 'นางสาว', viewValue: 'นางสาว' }
  ];
  activity: Array<any> = [
    { value: 'สมาชิก', viewValue: 'member' },
    { value: 'รถธรรมธุรกิจ', viewValue: 'delivery' },
    { value: 'คนขับรถธรรมธุรกิจ', viewValue: 'driver' },
    { value: 'ผู้ถือหุ้น', viewValue: 'shareholder' },
    { value: 'ผู้ค้า', viewValue: 'supplier' },
  ];

  ngOnInit(): void {
    
    this.involvedpartyService.getPostcodesList().subscribe((res: any) => {
      this.postcodes = res.data;
      this.temp = res.data;
      // console.log(this.postcodes);
    })

    this.involvedpartyData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        personalInfo: {
          title: "",
          firstNameThai: "",
          lastNameThai: "",
          citizenId: ""
        },
        contactAddress: {
          addressLine1: "",
          addressStreet: "",
          addressSubDistrict: "",
          addressDistrict: "",
          addressProvince: "",
          addressPostalCode: "",
        },
        // membership: [
        //   {
        //     activity: "",
        //     memberReference: ""
        //   }
        // ]
      };

    if (this.involvedpartyData.directContact || this.involvedpartyData.membership) {
      console.log('case Edit');
      this.involvedpartyForm = this.editForm();
      this.caseEditArray();
      this.caseEditmembershipArray();
    } else {
      console.log('case New');
      this.involvedpartyForm = this.createForm();
    }
    this.spinner.hide();
  }



  get formData() { return <FormArray>this.involvedpartyForm.get('directContact'); }

  createForm(): FormGroup {
    let MOBILE_PATTERN = /^[0-9]{10,10}$/;
    return this.formBuilder.group({
      personalInfo: this.createPersonalInfoForm(),
      directContact: this.formBuilder.array([
        this.formBuilder.group(
          {
            method: "mobile",
            value: [
              "",
              [Validators.required, Validators.pattern(MOBILE_PATTERN)],
            ]
          }
        ),
        this.formBuilder.group(
          {
            method: "home",
            value: [
              "",
              [Validators.required, Validators.pattern(MOBILE_PATTERN)],
            ]
          }
        ),
        this.formBuilder.group(
          {
            method: "other",
            value: [
              "",
              [Validators.required, Validators.pattern(MOBILE_PATTERN)],
            ]
          }
        )
      ]),
      contactAddress: this.createContactAddressForm(),
      membership: this.formBuilder.array([this.createItem()]),
    });
  }

  createPersonalInfoForm(): FormGroup {
    let PERSONAL_CARDID_PATTERN = /^[0-9]{13,13}$/;
    return this.formBuilder.group({
      title: [this.involvedpartyData.personalInfo.title, Validators.required],
      firstNameThai: [this.involvedpartyData.personalInfo.firstNameThai, Validators.required],
      lastNameThai: [this.involvedpartyData.personalInfo.lastNameThai, Validators.required],
      citizenId: [this.involvedpartyData.personalInfo.citizenId,
      [Validators.required, Validators.pattern(PERSONAL_CARDID_PATTERN)]]
    });
  }

  createContactAddressForm(): FormGroup {
    let POSTCODE_PATTERN = /^[0-9]{5,5}$/;
    return this.formBuilder.group({
      addressLine1: [this.involvedpartyData.contactAddress.addressLine1, Validators.required],
      addressStreet: [this.involvedpartyData.contactAddress.addressStreet, Validators.required],
      addressSubDistrict: [this.involvedpartyData.contactAddress.addressSubDistrict, Validators.required],
      addressDistrict: [this.involvedpartyData.contactAddress.addressDistrict, Validators.required],
      addressProvince: [this.involvedpartyData.contactAddress.addressProvince, Validators.required],
      addressPostalCode: [this.involvedpartyData.contactAddress.addressPostalCode,
      [Validators.required, , Validators.pattern(POSTCODE_PATTERN)]],
    });
  }

  editForm(): FormGroup {
    return this.formBuilder.group({
      personalInfo: this.createPersonalInfoForm(),
      directContact: this.formBuilder.array([]),
      contactAddress: this.createContactAddressForm(),
      membership: this.formBuilder.array([]),
    });
  }
  caseEditArray() {
    this.directContact = this.involvedpartyForm.get('directContact') as FormArray;
    this.involvedpartyData.directContact.forEach(el => {
      this.directContact.push(this.formBuilder.group(
        {
          method: el.method,
          value: el.value
        }
      ));
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      activity: "",
      memberReference: ""
    });
  }

  addItem(): void {
    this.membership = this.involvedpartyForm.get('membership') as FormArray;
    this.membership.push(this.formBuilder.group({
      activity: "",
      memberReference: ""
    }));
  }

  caseEditmembershipArray() {
    this.membership = this.involvedpartyForm.get('membership') as FormArray;
    this.involvedpartyData.membership.forEach(el => {
      this.membership.push(this.formBuilder.group(
        {
          activity: el.activity,
          memberReference: el.memberReference
        }
      ));
    });
  }

  deleteItem(i) {
    this.membership = this.involvedpartyForm.get('membership') as FormArray;
    this.membership.removeAt(i)
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if (this.involvedpartyData._id) {
      this.involvedpartyForm.value._id = this.involvedpartyData._id;
      this.involvedpartyService
        .updateInvolvedpartyData(this.involvedpartyForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.involvedpartyService
        .createInvolvedpartyData(this.involvedpartyForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }

  formControl() {
    return (this.involvedpartyForm.get('directContact') as FormArray).controls;
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.postcode.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.postcodes = temp;
    // console.log(this.postcodes);
  }

  getPosts(val) {

    //12150 | บึงคำพร้อย | อำเภอลำลูกกา | ปทุมธานี
    let viewValue = val.viewValue;
    let arrValue = val.viewValue.split("|");
    let subdistrict = arrValue[1].trim();
    let district = arrValue[2].trim();
    let province = arrValue[3].trim();

    let contactAddress: FormGroup = <FormGroup>this.involvedpartyForm.controls["contactAddress"];
    contactAddress.controls["addressProvince"].setValue(
      province
    );
    contactAddress.controls["addressDistrict"].setValue(
      district
    );
    contactAddress.controls["addressSubDistrict"].setValue(
      subdistrict
    );

  }

}
