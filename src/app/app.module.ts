import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import {
  MatMomentDateModule,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  MatButtonModule,
  MatIconModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatSnackBarModule
} from "@angular/material";
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SampleModule } from 'app/main/sample/sample.module';
import { GlobalErrorHandler } from "./global-error-handler";
import { ServerErrorInterceptor } from "./server-error.interceptor";

const appRoutes: Routes = [
    {
        path        : 'auth',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
    },
    {
        path      : '**',
        redirectTo: 'sample'
    }
];

export const MY_FORMATS = {
    parse: {
      dateInput: "DD/MM/YYYY"
    },
    display: {
      dateInput: "DD/MM/YYYY",
      monthYearLabel: "MMMM YYYY",
      dateA11yLabel: "DD/MM/YYYY",
      monthYearA11yLabel: "MM YYYY"
    }
  };

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        NgxSpinnerModule,
        SampleModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        // { provide: ErrorHandler, useClass: GlobalErrorHandler },
        // {
        //   provide: HTTP_INTERCEPTORS,
        //   useClass: ServerErrorInterceptor,
        //   multi: true
        // },
        { provide: MAT_DATE_LOCALE, useValue: "th-TH" },
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
      ]
})
export class AppModule
{
}
