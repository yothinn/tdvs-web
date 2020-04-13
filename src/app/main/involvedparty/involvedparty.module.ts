import { NgModule } from '@angular/core';
import { InvolvedpartyListComponent } from './list/involvedpartyList.component';
import { InvolvedpartyFormComponent } from './form/involvedpartyForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { InvolvedpartyService } from './services/involvedparty.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes = [
  {
    path: "involvedpartyForm/:id",
    component: InvolvedpartyFormComponent,
    resolve: { items: InvolvedpartyService },
    // canActivate: [AuthenGuardService]
  },
  {
    path: '**',
    component: InvolvedpartyListComponent,
    resolve: { items: InvolvedpartyService },
    // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    InvolvedpartyListComponent,
    InvolvedpartyFormComponent
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
    InvolvedpartyListComponent,
    InvolvedpartyFormComponent
  ]
})
export class InvolvedpartyModule { }
