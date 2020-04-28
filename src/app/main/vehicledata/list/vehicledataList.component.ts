import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { VehicledataService } from '../services/vehicledata.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-vehicledata-list',
  templateUrl: './vehicledataList.component.html',
  styleUrls: ['./vehicledataList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicledataListComponent implements OnInit {

  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private vehicledataService: VehicledataService,
    private spinner: NgxSpinnerService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.checkList();
  }

  checkList() {
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      if (row.ownerInfo.displayName) {
        // console.log("displayName");
        row.ownerInfo.displayName;
      } else {
        // console.log("firstName" + " " + "lastName");
        row.ownerInfo.displayName = row.ownerInfo.firstName + " " + row.ownerInfo.lastName
      }
    }
  }

  addData() {
    this.router.navigateByUrl("/vehicledata/vehicledataForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/vehicledata/vehicledataForm/" + item._id);
  }

  deleteData(item) {
    this.vehicledataService.deleteVehicledataData(item).then((res) => {
      this.vehicledataService.getVehicledataDataList().subscribe((res: any) => {
        this.rows = res.data;
        this.checkList();
      })
    })
  }

  updateFilter(event) {
    //change search keyword to lower case
    // const val = event.target.value.toLowerCase();

    // filter our data

  }

}
