import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent } from 'app/authentication/register/register.component';
import { InvolvedpartyService } from 'app/main/involvedparty/services/involvedparty.service';
import { AuthenGuardService } from '../authen-guard.service';

const routes = [
    {
        path     : 'register',
        component: RegisterComponent
    },
    {
        path: "registerForm/:id",
        component: RegisterComponent,
        resolve: { items: InvolvedpartyService },
        canActivate: [AuthenGuardService]
      }
  
];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        FuseSharedModule
    ]
})
export class RegisterModule
{
}
