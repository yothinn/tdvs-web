import { NgModule } from '@angular/core';
import { VehicleListComponent } from './list/vehicleList.component';
import { VehicleFormComponent } from './form/vehicleForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { VehicleService } from './services/vehicle.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const routes = [
  {
    path: "vehicleForm/:id",
    component: VehicleFormComponent,
    resolve: { items: VehicleService },
    canActivate: [AuthenGuardService]
  },
  {
    path     : '**',
    component: VehicleListComponent,
    resolve: { items: VehicleService },
    canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    VehicleListComponent, 
    VehicleFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatAutocompleteModule,

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
    VehicleListComponent,
    VehicleFormComponent
  ]
})
export class VehicleModule { }
