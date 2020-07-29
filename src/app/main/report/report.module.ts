import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JoborderReportComponent } from './joborder-report/joborder-report.component';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { ReportService } from './report.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import {  MatButtonModule,
          MatIconModule,
       } from "@angular/material";
import { ShareModule } from 'app/share/share.module';

// 
const routes = [
  { // /report/joborder/:id
    path: "joborder/:id",
    component: JoborderReportComponent,
    canActivate: [AuthenGuardService],
    resolve: { items: ReportService },
  },
  { // /report/joborder
    path: "joborder",
    component: JoborderReportComponent,
    canActivate: [AuthenGuardService],
    resolve: { items: ReportService },
  },
];

@NgModule({
  declarations: [
    JoborderReportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    ShareModule,

    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
  ],
  exports: [
    JoborderReportComponent,
  ],
})
export class ReportModule { }
