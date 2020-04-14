import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FuseTranslationLoaderService } from "@fuse/services/translation-loader.service";
import { fuseAnimations } from "@fuse/animations";

import { locale as english } from "../i18n/en";
import { locale as thai } from "../i18n/th";
import { Router, ActivatedRoute } from "@angular/router";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { InvolvedpartyService } from "../services/involvedparty.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-involvedparty-list",
  templateUrl: "./involvedpartyList.component.html",
  styleUrls: ["./involvedpartyList.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class InvolvedpartyListComponent implements OnInit {
  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private involvedpartyService: InvolvedpartyService,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
  }

  addData() {
    this.router.navigateByUrl("/involvedparty/involvedpartyForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/involvedparty/involvedpartyForm/" + item._id);
  }

  deleteData(item) {
    this.spinner.show();
    this.involvedpartyService.deleteInvolvedpartyData(item).then((res) => {
      this.involvedpartyService
        .getInvolvedpartyDataList()
        .subscribe((res: any) => {
          this.spinner.hide;
          this.rows = res.data;
          this.temp = res.data;
        });
    });
  }

  updateFilter(event) {
    //change search keyword to lower case
    const val = event.target.value.toLowerCase();
    console.log(val);
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.personalInfo.firstNameThai.toLowerCase().indexOf(val) !== -1 
      || d.personalInfo.lastNameThai.toLowerCase().indexOf(val) !== -1 
      || d.contactAddress.addressPostalCode.indexOf(val) !== -1
      || d.directContact[0].value.indexOf(val) !== -1
      || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }
}
