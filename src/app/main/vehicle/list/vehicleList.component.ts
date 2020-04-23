import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VehicleService } from '../services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicleList.component.html',
  styleUrls: ['./vehicleList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicleListComponent implements OnInit {

  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
  }

  addData() {
    this.router.navigateByUrl("/vehicle/vehicleForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/vehicle/vehicleForm/" + item._id);
  }

  deleteData(item) {
    this.vehicleService.deleteVehicleData(item).then((res) => {
      this.vehicleService.getVehicleDataList().subscribe((res: any) => {
        this.rows = res.data;
      })
    })
  }

  updateFilter(event) {
    //change search keyword to lower case
    // const val = event.target.value.toLowerCase();

    // filter our data
    
  }

}
