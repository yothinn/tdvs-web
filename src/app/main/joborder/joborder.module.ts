import { NgModule } from '@angular/core';
import { JoborderListComponent } from './list/joborderList.component';
import { JoborderFormComponent } from './form/joborderForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import {  MatIconModule, 
          MatMenuModule, 
          MatSelectModule, 
          MatDatepickerModule, 
          MatFormFieldModule, 
          MatInputModule, 
          MatListModule, 
          MatButtonModule, 
          MatTabsModule, 
          MatProgressSpinnerModule, 
          MatSliderModule, 
          MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { JoborderService } from './services/joborder.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SelectCarAndDateComponent } from './select-car-and-date/select-car-and-date.component';
import { JoborderPdfComponent } from './joborder-pdf/joborder-pdf.component';
import { ServiceDateFilterPipe } from './select-car-and-date/select-car-and-date.pipe';
import { RejectReasonModalComponent } from './reject-reason-modal/reject-reason-modal.component';
import { ShareModule } from 'app/share/share.module';
import { JobordersuggestionComponent } from './jobordersuggestion/jobordersuggestion.component';
import { JoborderDataComponent } from './joborder-data/joborder-data.component';
import { MarkerInfoWindowComponent } from './marker-info-window/marker-info-window.component';
import { SearchFiltersDataComponent } from './search-filters-data/search-filters-data.component';


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
    path: "suggestion",
    component: JobordersuggestionComponent,
    //resolve: { items: JoborderService },
    canActivate: [AuthenGuardService]
  },
  {
    path: 'list',
    component: JoborderListComponent,
    resolve: { items: JoborderService },
    canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    JoborderListComponent,
    JoborderFormComponent, 
    SelectCarAndDateComponent, 
    JoborderPdfComponent, 
    ServiceDateFilterPipe, 
    RejectReasonModalComponent, 
    JobordersuggestionComponent, 
    JoborderDataComponent, 
    MarkerInfoWindowComponent, 
    SearchFiltersDataComponent,
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
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,

    DragDropModule,
    FlexLayoutModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDnjHI8F5TKYn8Vu8nUtqOn1sVOq2UInQE'
    }),

    MatSliderModule,

    TranslateModule,
    FuseSharedModule,
    NgxDatatableModule,

    ShareModule,
  ],
  exports: [
    JoborderListComponent,
    JoborderFormComponent
  ],
  entryComponents: [
    SelectCarAndDateComponent,
    RejectReasonModalComponent
  ]
})
export class JoborderModule { }
