import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { VehicledataService } from '../services/vehicledata.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vehicledata-form',
  templateUrl: './vehicledataForm.component.html',
  styleUrls: ['./vehicledataForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicledataFormComponent implements OnInit {
  vehicledataForm: FormGroup;
  vehicledataData: any = {};

  isCompany: string[] = ['บริษัท ธรรมธุรกิจ วิสาหกิจเพื่อสังคม จำกัด', 'รถร่วมบริการ'];

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

    this.vehicledataData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        lisenceID: "",
        vehicleType: "",
        vehicleColor: "",
        vehicleBrand: "",
        ownerInfo: {
          title: "",
          firstName: "",
          lastName: "",
          displayName: "",
          isCompany: "",
          refId: "",
          mobileNo1: "",
          mobileNo2: "",
          mobileNo3: "",
          addressLine1: "",
          addressStreet: "",
          addressSubDistrict: "",
          addressDistrict: "",
          addressProvince: "",
          addressPostCode: ""
        }
      };
    if (this.vehicledataData._id) {
      console.log("case Edit");
      this.vehicledataForm = this.editForm();
    } else {
      console.log("case New");
      this.vehicledataForm = this.createForm();
    }

    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      lisenceID: [this.vehicledataData.lisenceID, Validators.required],
      vehicleType: [this.vehicledataData.vehicleType, Validators.required],
      vehicleColor: [this.vehicledataData.vehicleColor, Validators.required],
      vehicleBrand: [this.vehicledataData.vehicleBrand, Validators.required],
      ownerInfo: this.ownerInfoForm()
    });
  }
  ownerInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.vehicledataData.ownerInfo.title],
      firstName: [this.vehicledataData.ownerInfo.firstName, Validators.required],
      lastName: [this.vehicledataData.ownerInfo.lastName, Validators.required],
      displayName: [this.vehicledataData.ownerInfo.displayName, Validators.required],
      isCompany: [this.vehicledataData.ownerInfo.displayName],
      refId: [this.vehicledataData.ownerInfo.refId, Validators.required],
      mobileNo1: [this.vehicledataData.ownerInfo.mobileNo1, Validators.required],
      mobileNo2: [this.vehicledataData.ownerInfo.mobileNo2],
      mobileNo3: [this.vehicledataData.ownerInfo.mobileNo3],
      addressLine1: [this.vehicledataData.ownerInfo.addressLine1, Validators.required],
      addressStreet: [this.vehicledataData.ownerInfo.addressStreet, Validators.required],
      addressSubDistrict: [this.vehicledataData.ownerInfo.addressSubDistrict, Validators.required],
      addressDistrict: [this.vehicledataData.ownerInfo.addressDistrict, Validators.required],
      addressProvince: [this.vehicledataData.ownerInfo.addressProvince, Validators.required],
      addressPostCode: [this.vehicledataData.ownerInfo.addressPostCode, Validators.required],
    });
  }
  editForm(): FormGroup {
    return this.formBuilder.group({
      lisenceID: [this.vehicledataData.lisenceID, Validators.required],
      vehicleType: [this.vehicledataData.vehicleType, Validators.required],
      vehicleColor: [this.vehicledataData.vehicleColor, Validators.required],
      vehicleBrand: [this.vehicledataData.vehicleBrand, Validators.required],
      ownerInfo: this.ownerInfoForm()
    });
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if (this.vehicledataData._id) {
      this.vehicledataForm.value._id = this.vehicledataData._id;
      this.vehicledataService
        .updateVehicledataData(this.vehicledataForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.vehicledataService
        .createVehicledataData(this.vehicledataForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }


}
