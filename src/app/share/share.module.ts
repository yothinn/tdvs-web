import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThaicontactstatusPipe } from './pipe/thaicontactstatus.pipe';
import { ThaiorderstatusPipe } from './pipe/thaiorderstatus.pipe';

@NgModule({
  declarations: [
    ThaicontactstatusPipe,
    ThaiorderstatusPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ThaicontactstatusPipe,
    ThaiorderstatusPipe,
  ]
})
export class ShareModule { }
