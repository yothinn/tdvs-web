import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { JoborderReportComponent } from './joborder-report/joborder-report.component';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { ReportService } from './report.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  MatButtonModule,
          MatIconModule,
          MatMenuModule,
       } from "@angular/material";
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { ShareModule } from 'app/share/share.module';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SalesReportBydatesComponent } from './sales-report-bydates/sales-report-bydates.component';

// 
const routes = [
  { // /report/joborder/:id
    path: "joborder/:id",
    component: JoborderReportComponent,
    canActivate: [AuthenGuardService],
    resolve: { items: ReportService },
  },
  { // /report/sales
    path: "sales",
    component: SalesReportComponent,
    canActivate: [AuthenGuardService],
    resolve: { items: ReportService },
  },
];

@NgModule({
  declarations: [
    JoborderReportComponent,
    SalesReportComponent,
    SalesReportBydatesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    ShareModule,

    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    FlexLayoutModule,
    FuseSharedModule,
    NgxDatatableModule
  ],
  exports: [
    JoborderReportComponent,
  ],
})
export class ReportModule { }
