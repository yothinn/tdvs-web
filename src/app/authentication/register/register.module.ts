import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent } from 'app/authentication/register/register.component';
import { InvolvedpartyService } from 'app/main/involvedparty/services/involvedparty.service';
import { AuthenGuardService } from '../authen-guard.service';

const routes = [
    {
        path: ":id",
        component: RegisterComponent,
        resolve: { items: InvolvedpartyService },
        // canActivate: [AuthenGuardService]
    },
    {
        path: '**',
        component: RegisterComponent,
        // canActivate: [AuthenGuardService]
    }

];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,

        FuseSharedModule
    ]
})
export class RegisterModule {
}
