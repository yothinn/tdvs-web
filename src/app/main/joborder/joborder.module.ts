import { NgModule } from '@angular/core';
import { JoborderListComponent } from './list/joborderList.component';
import { JoborderFormComponent } from './form/joborderForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { JoborderService } from './services/joborder.service';

const routes = [
  {
    path: "joborderForm/:id",
    component: JoborderFormComponent,
    resolve: { items: JoborderService }
    // canActivate: [AuthenGuardService]
  },
  {
      path     : '**',
      component: JoborderListComponent,
      resolve: { items: JoborderService }
      // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    JoborderListComponent, 
    JoborderFormComponent
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
    JoborderListComponent,
    JoborderFormComponent
  ]
})
export class JoborderModule { }
