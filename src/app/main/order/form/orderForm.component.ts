import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';

import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-form',
  templateUrl: './orderForm.component.html',
  styleUrls: ['./orderForm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  orderData: any = {};
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private location: Location,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {

    this.orderData = this.route.snapshot.data.items
      ? this.route.snapshot.data.items.data
      : {
        name: ""
      };

    this.orderForm = this.createForm();
    this.spinner.hide();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      name: [this.orderData.name, Validators.required]
    });
  }

  goBack() {
    this.spinner.show();
    this.location.back();
  }

  async onSave() {
    this.spinner.show();

    if (this.orderData._id) {
      this.orderForm.value._id = this.orderData._id;
      this.orderService
        .updateOrderData(this.orderForm.value)
        .then(res => {
          // console.log(res);
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    } else {
      this.orderService
        .createOrderData(this.orderForm.value)
        .then(() => {
          this.location.back();
        })
        .catch(err => {
          this.spinner.hide();
        });
    }
  }


}
