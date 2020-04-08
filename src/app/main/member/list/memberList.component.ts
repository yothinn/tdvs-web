import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { fuseAnimations } from '@fuse/animations';

import { locale as english } from '../i18n/en';
import { locale as thai } from '../i18n/th';
import { Router, ActivatedRoute } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { MemberService } from '../services/member.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-member-list',
  templateUrl: './memberList.component.html',
  styleUrls: ['./memberList.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MemberListComponent implements OnInit {

  rows: Array<any>;
  temp = [];
  ColumnMode = ColumnMode;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private memberService: MemberService,
    private spinner: NgxSpinnerService,
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, thai);
  }


  ngOnInit(): void {
    this.spinner.hide();
    this.rows = this.route.snapshot.data.items.data;
  }

  addData() {
    this.router.navigateByUrl("/member/memberForm/new");
  }

  editData(item) {
    this.router.navigateByUrl("/member/memberForm/" + item._id);
  }

  deleteData(item) {
    this.memberService.deleteMemberData(item).then((res) => {
      this.memberService.getMemberDataList().subscribe((res: any) => {
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
