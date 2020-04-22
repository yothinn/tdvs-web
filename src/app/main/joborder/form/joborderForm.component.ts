import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { JoborderService } from '../services/joborder.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-joborder-form',
  templateUrl: './joborderForm.component.html',
  styleUrls: ['./joborderForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class JoborderFormComponent implements OnInit {
  joborderForm: FormGroup;
  joborderData: any = {};
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private joborderService: JoborderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.joborderData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
          name: ""
        };

    this.joborderForm = this.createForm();
    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.joborderData.name, Validators.required]
    });
  }

  goBack(){
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();
    
    if (this.joborderData._id) {
      this.joborderForm.value._id = this.joborderData._id;
      this.joborderService
        .updateJoborderData(this.joborderForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.joborderService
        .createJoborderData(this.joborderForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }


}
