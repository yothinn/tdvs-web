import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

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
  involvedpartyData: any = {};
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


  ngOnInit(): void {

    this.involvedpartyData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        personalInfo: {
          title: "",
          firstName: "",
          lastName: "",
          citizenId: ""
        },
        contactAddress: {
          addressLine1: "",
          addressStreet: "",
          addressSubDistrict: "",
          addressDistrict: "",
          addressProvince: "",
          addressPostalCode: "",
        }
      };

    if (this.involvedpartyData.directContact) {
      console.log('case Edit');
      this.involvedpartyForm = this.editForm();
      this.caseEditArray()
    } else {
      console.log('case New');
      this.involvedpartyForm = this.createForm();
    }
    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      personalInfo: this.createPersonalInfoForm(),
      directContact: this.formBuilder.array([
        this.formBuilder.group(
          {
            method: "mobile",
            value: ""
          }
        ),
        this.formBuilder.group(
          {
            method: "home",
            value: ""
          }
        ),
        this.formBuilder.group(
          {
            method: "other",
            value: ""
          }
        )
      ]),
      contactAddress: this.createContactAddressForm(),
    });
  }

  createPersonalInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.involvedpartyData.personalInfo.title],
      firstName: [this.involvedpartyData.personalInfo.firstName],
      lastName: [this.involvedpartyData.personalInfo.lastName],
      citizenId: [this.involvedpartyData.personalInfo.citizenId]
    });
  }

  createContactAddressForm(): FormGroup {
    return this.formBuilder.group({
      addressLine1: [this.involvedpartyData.contactAddress.addressLine1],
      addressStreet: [this.involvedpartyData.contactAddress.addressStreet],
      addressSubDistrict: [this.involvedpartyData.contactAddress.addressSubDistrict],
      addressDistrict: [this.involvedpartyData.contactAddress.addressDistrict],
      addressProvince: [this.involvedpartyData.contactAddress.addressProvince],
      addressPostalCode: [this.involvedpartyData.contactAddress.addressPostalCode],
    });
  }

  editForm(): FormGroup {
    return this.formBuilder.group({
      personalInfo: this.createPersonalInfoForm(),
      directContact: this.formBuilder.array([]),
      contactAddress: this.createContactAddressForm(),
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


}
