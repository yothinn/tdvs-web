import { Component, OnInit, ViewEncapsulation, ViewChild, AfterViewChecked } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { VehicledataService } from '../services/vehicledata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogConfirmService } from 'app/dialog-confirm/service/dialog-confirm.service';

@Component({
  selector: 'app-vehicledata-list',
  templateUrl: './vehicledataList.component.html',
  styleUrls: ['./vehicledataList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VehicledataListComponent implements OnInit, AfterViewChecked {

  @ViewChild('tableWrapper') tableWrapper;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  private currentComponentWidth;

  rows: Array<any> = null;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private vehicledataService: VehicledataService,
    private dialogConfirmService: DialogConfirmService,
    private spinner: NgxSpinnerService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    // console.log(this.rows);
    if (this.rows) {
      this.checkList();
    }
  }

  // For resize data table
  ngAfterViewChecked(): void {
    // Check if the table size has changed,
    if (this.table && this.table.recalculate && (this.tableWrapper.nativeElement.clientWidth !== this.currentComponentWidth)) {

      this.currentComponentWidth = this.tableWrapper.nativeElement.clientWidth;
      this.table.recalculate();
    }
  }

  // Checklist to add data to displayName field
  // TODO: ไปทำข้อมูลให้พร้อมตั้งแต่ก่อนเชฟ ไม่ใช้มาแก้ไขตรงนี้
  checkList() {
    for (let row of this.rows) {
      if (!row.ownerInfo.displayName || row.ownerInfo.displayName === '') {
        row.ownerInfo.displayName = row.ownerInfo.firstName + ' ' + row.ownerInfo.lastName;
      }
    }
  }

  addData(): void {
    this.router.navigate(['/vehicledata/vehicledataForm/new']);
  }

  editData(item): void {
    this.router.navigate(['/vehicledata/vehicledataForm', item._id]);
  }

  deleteData(item): void {
    const body = {
      title: 'กรุณายืนยันการ ลบรายการ',
      message: 'ข้อมูลรถทะเบียน : ' + item.lisenceID,
    };

    this.dialogConfirmService.show(body).then(async (result) => {
      if (result) {
        this.spinner.show();
        this.vehicledataService.deleteVehicledataData(item)
            .then((res) => {
              this.vehicledataService.getVehicledataDataList().subscribe((res: any) => {
                this.rows = res.data;
                this.checkList();
                this.spinner.hide();
              }, (err) => {
                this.spinner.hide();
              });
            }).catch(err => {
              this.spinner.hide();
            });
      }
    });
  }

  // updateFilter(event) {
  //   //change search keyword to lower case
  //   // const val = event.target.value.toLowerCase();

  //   // filter our data
  // }

}
