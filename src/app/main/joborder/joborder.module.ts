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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SelectCarAndDateComponent } from './select-car-and-date/select-car-and-date.component';
import { JoborderPdfComponent } from './joborder-pdf/joborder-pdf.component';
import { ServiceDateFilterPipe } from './select-car-and-date/select-car-and-date.pipe';


const routes = [
  {
    path: "joborderForm/:id",
    component: JoborderFormComponent,
    resolve: { items: JoborderService },
    canActivate: [AuthenGuardService]
  },
  {
    path: "joborderPdf/:id",
    component: JoborderPdfComponent,
    resolve: { items: JoborderService },
    canActivate: [AuthenGuardService]
  },
  {
    path: '**',
    component: JoborderListComponent,
    resolve: { items: JoborderService },
    canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    JoborderListComponent,
    JoborderFormComponent, SelectCarAndDateComponent, JoborderPdfComponent, 
    ServiceDateFilterPipe
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
    MatSnackBarModule,
    MatSidenavModule,
    DragDropModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2aNk7BXJ13EyVfPZXWRVqEcnfzfRVVIA'
    }),

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
  ],
  entryComponents: [
    SelectCarAndDateComponent
  ]
})
export class JoborderModule { }
