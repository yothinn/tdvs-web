import { NgModule } from '@angular/core';
import { TvdscustomerListComponent } from './list/tvdscustomerList.component';
import { TvdscustomerFormComponent } from './form/tvdscustomerForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { TvdscustomerService } from './services/tvdscustomer.service';

const routes = [
  {
    path: "tvdscustomerForm/:id",
    component: TvdscustomerFormComponent,
    resolve: { items: TvdscustomerService },
    // canActivate: [AuthenGuardService]
  },
  {
      path     : '**',
      component: TvdscustomerListComponent,
      resolve: { items: TvdscustomerService },
      // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    TvdscustomerListComponent, 
    TvdscustomerFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    FormsModule,
    ReactiveFormsModule,

    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTableModule,
    MatRadioModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDialogModule,

    MatTreeModule,
    MatSliderModule,
    MatToolbarModule,

    TranslateModule,
    FuseSharedModule,
    NgxDatatableModule
  ],
  exports: [
    TvdscustomerListComponent,
    TvdscustomerFormComponent
  ]
})
export class TvdscustomerModule { }
