import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VehicleService } from '../services/vehicle.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogConfirmService } from 'app/dialog-confirm/service/dialog-confirm.service';

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

  page = {
    limit: 10,
    count: 0,
    offset: 0,
  };
  keyword = "";

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private spinner: NgxSpinnerService,
    public dialogConfirmService: DialogConfirmService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    this.page.count = this.route.snapshot.data.items.totalCount;
  }

  addData() {
    this.router.navigateByUrl("/vehicle/vehicleForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/vehicle/vehicleForm/" + item._id);
  }

  deleteData(item) {
    
    const body = {
      title: "ยืนยันการลบ",
      message: "กรุณาตรวจสอบอีกรอบ",
    };
    this.dialogConfirmService.show(body).then(async (result) => {
      if (result) {
        this.spinner.show();
        let deleted = await this.vehicleService.deleteVehicleData(
          item
        );
        this.reloadData();
        this.spinner.hide();
    
      }
    });

    // this.vehicleService.deleteVehicleData(item).then((res) => {
    //   this.vehicleService.getVehicleDataList().subscribe((res: any) => {
    //     this.rows = res.data;
    //   })
    // })
  }

  pageCallback(pageInfo: {
    count?: number;
    pageSize?: number;
    limit?: number;
    offset?: number;
  }) {
    this.page.offset = pageInfo.offset;
    this.reloadData();
  }

  async reloadData() {
    console.log(this.keyword);
    let res: any = await this.vehicleService.getVehicleDataList(
      this.page.offset,
      this.page.limit,
      this.keyword
    );
    console.log(res.data);
    this.rows = res.data;
    this.temp = res.data;
    this.page.count = res.totalCount;
  }

  updateFilter(event) {
    //change search keyword to lower case
    // const val = event.target.value.toLowerCase();

    // filter our data
    this.keyword = event.target.value;
    this.reloadData();
    this.page.offset = 0;
    
  }

}
