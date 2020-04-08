import { NgModule } from '@angular/core';
import { MemberListComponent } from './list/memberList.component';
import { MemberFormComponent } from './form/memberForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MemberService } from './services/member.service';

const routes = [
  {
    path: "memberForm/:id",
    component: MemberFormComponent,
    resolve: { items: MemberService }
    // canActivate: [AuthenGuardService]
  },
  {
    path: '**',
    component: MemberListComponent,
    resolve: { items: MemberService }
    // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    MemberListComponent,
    MemberFormComponent
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
    MemberListComponent,
    MemberFormComponent
  ]
})
export class MemberModule { }
