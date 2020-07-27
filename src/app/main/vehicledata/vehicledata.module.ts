import { NgModule } from '@angular/core';
import { VehicledataListComponent } from './list/vehicledataList.component';
import { VehicledataFormComponent } from './form/vehicledataForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule, MatAutocompleteModule, MatSlideToggleModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { VehicledataService } from './services/vehicledata.service';

const routes = [
  {
    path: "vehicledataForm/:id",
    component: VehicledataFormComponent,
    resolve: { items: VehicledataService },
    canActivate: [AuthenGuardService]
  },
  {
    path     : '**',
    component: VehicledataListComponent,
    resolve: { items: VehicledataService },
    canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    VehicledataListComponent, 
    VehicledataFormComponent
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

    MatAutocompleteModule,
    MatSlideToggleModule,

    TranslateModule,
    FuseSharedModule,
    NgxDatatableModule
  ],
  exports: [
    VehicledataListComponent,
    VehicledataFormComponent
  ]
})
export class VehicledataModule { }
