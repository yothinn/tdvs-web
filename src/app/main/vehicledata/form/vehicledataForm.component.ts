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
  postcodesList: any = [];
  temp = [];

  // isOwner: string[] = ['บริษัท ธรรมธุรกิจ วิสาหกิจเพื่อสังคม จำกัด', 'รถร่วมบริการ'];
  // isCompany: string[] = ['บุคคลธรรมดา', 'นิติบุคคล'];
  isOwner: any[] = [
    { name: 'บริษัท ธรรมธุรกิจ วิสาหกิจเพื่อสังคม จำกัด', value: 'true' },
    { name: 'รถร่วมบริการ', value: 'false' }
  ];

  isCompany: any[] = [
    { name: 'บุคคลธรรมดา', value: 'Individual' },
    { name: 'นิติบุคคล', value: 'Legalentity' }
  ];

  vehicleType: Array<any> = [
    { value: 'กระบะ ตอนเดียว', viewValue: 'กระบะ ตอนเดียว' },
    { value: 'กระบะ 4 ประตู', viewValue: 'กระบะ 4 ประตู' }
    // { value: 'กระบะ ตอนเดียว', viewValue: 'Pickup in one episode' },
    // { value: 'กระบะ แคป', viewValue: 'Pickup Truck Cap' },
    // { value: 'กระบะ 4 ประตู', viewValue: 'Pickup Double Cab' }
  ];

  vehicleBrand: Array<any> = [
    { value: 'โตโยต้า รีโว่', viewValue: 'โตโยต้า รีโว่' },
    { value: 'อีซูซุ', viewValue: 'อีซูซุ' },
    { value: 'ฟอร์ดเรนเจอร์', viewValue: 'ฟอร์ดเรนเจอร์' },
    { value: 'มาสด้า BT-50', viewValue: 'มาสด้า BT-50' },
    { value: 'มิตซูบิชิไทรทัน', viewValue: 'มิตซูบิชิไทรทัน' },
    { value: 'นิสสันนาวารา', viewValue: 'นิสสันนาวารา' },
    { value: 'เชฟโรเลตโคโลราโด', viewValue: 'เชฟโรเลตโคโลราโด' },
    { value: 'ทาทาซีนอน', viewValue: 'ทาทาซีนอน' }
    // { value: 'โตโยต้า', viewValue: 'Toyota Revo' },
    // { value: 'อีซูซุ', viewValue: 'Isuzu D-MAX' },
    // { value: 'ฟอร์ดเรนเจอร์', viewValue: 'Ford Ranger' },
    // { value: 'มาสด้า BT-50', viewValue: 'Mazda BT-50' },
    // { value: 'มิตซูบิชิไทรทัน', viewValue: 'Mitsubishi Triton' },
    // { value: 'นิสสันนาวารา', viewValue: 'Nissan Navara' },
    // { value: 'เชฟโรเลตโคโลราโด', viewValue: 'Chevrolet Colorado' },
    // { value: 'ทาทาซีนอน', viewValue: 'TATA Xenon' }
  ];

  vehicleColor: Array<any> = [
    // { value: 'สีแดง', viewValue: 'red' },
    // { value: 'สีน้ำเงิน', viewValue: 'blue' },
    // { value: 'สีม่วง', viewValue: 'purple' }
    { value: 'สีแดง', viewValue: 'สีแดง' },
    { value: 'สีน้ำเงิน', viewValue: 'สีน้ำเงิน' },
    { value: 'สีม่วง', viewValue: 'สีม่วง' }
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
    })

    this.vehicledataData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        lisenceID: "",
        vehicleType: "",
        vehicleColor: "",
        vehicleBrand: "",
        isOwner: "",
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
      isOwner: [this.vehicledataData.isOwner || 'true', Validators.required],
      ownerInfo: this.ownerInfoForm()
    });
  }
  ownerInfoForm(): FormGroup {
    return this.formBuilder.group({
      title: [this.vehicledataData.ownerInfo.title],
      firstName: [this.vehicledataData.ownerInfo.firstName],
      lastName: [this.vehicledataData.ownerInfo.lastName],
      displayName: [this.vehicledataData.ownerInfo.displayName],
      isCompany: [this.vehicledataData.ownerInfo.isCompany || 'Individual'],
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
      isOwner: [this.vehicledataData.isOwner || 'true', Validators.required],
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
    let viewValue = val.viewValue;
    let arrValue = val.viewValue.split("|");
    let subdistrict = arrValue[1].trim();
    let district = arrValue[2].trim();
    let province = arrValue[3].trim();

    let ownerInfo: FormGroup = <FormGroup>this.vehicledataForm.controls["ownerInfo"];
    ownerInfo.controls["addressProvince"].setValue(
      province
    );
    ownerInfo.controls["addressDistrict"].setValue(
      district
    );
    ownerInfo.controls["addressSubDistrict"].setValue(
      subdistrict
    );
  }


}
