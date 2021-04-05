import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinechatPanelComponent } from './linechat-panel/linechat-panel.component';
import { LinechatLoginDialogComponent } from './linechat-login-dialog/linechat-login-dialog.component';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LinechatPanelComponent, LinechatLoginDialogComponent],
  imports: [
    CommonModule,

    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
  ]
})
export class LinechatModule { }
