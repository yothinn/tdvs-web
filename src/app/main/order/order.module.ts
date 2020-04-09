import { NgModule } from '@angular/core';
import { OrderListComponent } from './list/orderList.component';
import { OrderFormComponent } from './form/orderForm.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { AuthenGuardService } from 'app/authentication/authen-guard.service';
import { MatIconModule, MatMenuModule, MatSelectModule, MatDatepickerModule, MatFormFieldModule, MatTableModule, MatRadioModule, MatInputModule, MatListModule, MatButtonModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, MatTreeModule, MatSliderModule, MatToolbarModule, MatDialogModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { OrderService } from './services/order.service';
import { CarAndDateComponent } from './car-and-date/car-and-date.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AgmCoreModule } from '@agm/core';

const routes = [
  {
    path: "orderForm/:id",
    component: OrderFormComponent,
    resolve: { items: OrderService }
    // canActivate: [AuthenGuardService]
  },
  {
    path: '**',
    component: OrderListComponent,
    resolve: { items: OrderService }
    // canActivate: [AuthenGuardService]
  }
];

@NgModule({
  declarations: [
    OrderListComponent,
    OrderFormComponent,
    CarAndDateComponent
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
    MatSidenavModule,

    TranslateModule,
    FuseSharedModule,
    NgxDatatableModule,

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD2aNk7BXJ13EyVfPZXWRVqEcnfzfRVVIA'
    })
  ],
  exports: [
    OrderListComponent,
    OrderFormComponent
  ],
  entryComponents: [
    CarAndDateComponent
  ]
})
export class OrderModule { }
