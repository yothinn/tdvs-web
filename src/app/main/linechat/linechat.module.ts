import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinechatPanelComponent } from './linechat-panel/linechat-panel.component';
import { LinechatLoginDialogComponent } from './linechat-login-dialog/linechat-login-dialog.component';
import { MatDialogModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  declarations: [LinechatPanelComponent, LinechatLoginDialogComponent],
  imports: [
    CommonModule,

    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ]
})
export class LinechatModule { }
