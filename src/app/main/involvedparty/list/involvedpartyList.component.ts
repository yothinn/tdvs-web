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
    private involvedpartyService: InvolvedpartyService,
    private spinner: NgxSpinnerService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
    this.temp = this.route.snapshot.data.items.data;
    this.page.count = this.route.snapshot.data.items.totalCount
  }

  addData() {
    this.router.navigateByUrl("/involvedparty/involvedpartyForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/involvedparty/involvedpartyForm/" + item._id);
  }

  async deleteData(item) {
    this.spinner.show();
    let deleted = await this.involvedpartyService.deleteInvolvedpartyData(item);
    this.reloadData();
  }

  pageCallback(pageInfo: { count?: number, pageSize?: number, limit?: number, offset?: number }) {
    this.page.offset = pageInfo.offset;
    this.reloadData();
  }

  async reloadData() {
    console.log(this.keyword);
    let res: any = await this.involvedpartyService.getInvolvedpartyDataList(
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
    this.keyword = event.target.value;
    this.reloadData();
    this.page.offset = 0;
  }
}
