import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { MemberService } from '../services/member.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-form',
  templateUrl: './memberForm.component.html',
  styleUrls: ['./memberForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MemberFormComponent implements OnInit {
  memberForm: FormGroup;
  memberData: any = {};
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private memberService: MemberService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.memberData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        personalInfo: {
          title: "",
          firstName: "",
          lastName: ""
        },
        // contactNumber: {
        //   mobilePhoneNumber: "",
        //   houseNumber: "",
        //   otherNumber1: "",
        //   otherNumber2: "",
        //   otherNumber3: "",
        // },
        contactAddress: {
          addressLine1: "",
          addressSubDistrict: "",
          addressDistrict: "",
          addressProvince: "",
          addressPostalCode: "",
        },
      };

    this.memberForm = this.createForm();
    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      personalInfo: this.createPersonalInfoForm(),
      // contactNumber: this.createContactNumberForm(),
      contactAddress: this.createContactAddressForm()
    });
  }
  createPersonalInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.memberData.personalInfo.title],
      firstName: [this.memberData.personalInfo.firstName],
      lastName: [this.memberData.personalInfo.lastName]
    });
  }
  createContactNumberForm(): FormGroup {
    return this.formBuilder.group({
      mobilePhoneNumber: [this.memberData.contactNumber.mobilePhoneNumber],
      houseNumber: [this.memberData.contactNumber.houseNumber],
      otherNumber1: [this.memberData.contactNumber.otherNumber1],
      otherNumber2: [this.memberData.contactNumber.otherNumber2],
      otherNumber3: [this.memberData.contactNumber.otherNumber3]
    });
  }
  createContactAddressForm(): FormGroup {
    return this.formBuilder.group({
      addressLine1: [this.memberData.contactAddress.addressLine1],
      addressSubDistrict: [this.memberData.contactAddress.addressSubDistrict],
      addressDistrict: [this.memberData.contactAddress.addressDistrict],
      addressProvince: [this.memberData.contactAddress.addressProvince],
      addressPostalCode: [this.memberData.contactAddress.addressPostalCode],
    });
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if (this.memberData._id) {
      this.memberForm.value._id = this.memberData._id;
      this.memberService
        .updateMemberData(this.memberForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.memberService
        .createMemberData(this.memberForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }


}
