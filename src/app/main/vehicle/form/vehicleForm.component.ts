import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { VehicleService } from '../services/vehicle.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicleForm.component.html',
  styleUrls: ['./vehicleForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;
  vehicleData: any = {};
  tvdsCustomersData: Array<any> = [];
  temp: Array<any> = [];
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


   ngOnInit()  {

    this.vehicleService.getTvdsCustomerList().subscribe((res: any) => {
      this.tvdsCustomersData = res.data;
      this.temp = res.data;
    })

    this.vehicleData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          lisenceID: "",
          startDate: '',
          endDate: '',
          driverInfo: {
              displayName: ''
          }
        };

        if (this.vehicleData._id) {
          console.log('case Edit');
          this.vehicleForm = this.editForm();
        } else {
          console.log('case New');
          this.vehicleForm = this.createForm();
        }

    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      lisenceID: [this.vehicleData.lisenceID, Validators.required],
      startDate: [this.vehicleData.startDate, Validators.required],
      endDate: [this.vehicleData.endDate],
      driverInfo: this.driverInfoForm()
    });
  }

  editForm(): FormGroup {
    return this.formBuilder.group({
      lisenceID: [this.vehicleData.lisenceID, Validators.required],
      startDate: [this.vehicleData.startDate, Validators.required],
      endDate: [this.vehicleData.endDate],
      driverInfo: this.driverInfoForm()
    })
  }

  driverInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.vehicleData.driverInfo.title],
      firstName: [this.vehicleData.driverInfo.firstName],
      lastName: [this.vehicleData.driverInfo.displayName],
      displayName: [this.vehicleData.driverInfo.displayName, Validators.required],
      persanalId: [this.vehicleData.driverInfo.persanalId],
      isShareHolder: [this.vehicleData.driverInfo.isShareHolder],
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

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.displayName.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tvdsCustomersData = temp;
    // console.log(this.postcodes);
  }

  getTvdsCustomers(option){
    // filter our data
    const temp: any = this.temp.filter(function (d) {
      return d.displayName.toLowerCase().indexOf(option.value) !== -1 || !option.value;
    });
    console.log(temp);
    let driverInfo: FormGroup = <FormGroup>this.vehicleForm.controls["driverInfo"];
    driverInfo.controls["title"].setValue(
      temp[0].title
    );
    driverInfo.controls["firstName"].setValue(
      temp[0].firstName
    );
    driverInfo.controls["lastName"].setValue(
      temp[0].lastName
    );
  }

  goBack(){
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();
    
    if (this.vehicleData._id) {
      this.vehicleForm.value._id = this.vehicleData._id;
      this.vehicleService
        .updateVehicleData(this.vehicleForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.vehicleService
        .createVehicleData(this.vehicleForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }


}
