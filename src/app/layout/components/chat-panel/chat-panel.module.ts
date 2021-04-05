import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRippleModule, MatTabsModule, MatTooltipModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ChatPanelComponent } from 'app/layout/components/chat-panel/chat-panel.component';
import { ChatPanelService } from 'app/layout/components/chat-panel/chat-panel.service';
import { LinechatLoginDialogComponent } from 'app/main/linechat/linechat-login-dialog/linechat-login-dialog.component';
import { LinechatModule } from 'app/main/linechat/linechat.module';


@NgModule({
    declarations: [
        ChatPanelComponent
    ],
    providers   : [
        ChatPanelService
    ],
    imports     : [
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTabsModule,
        MatTooltipModule,
        MatRippleModule,
        MatDialogModule,

        FuseSharedModule,
        LinechatModule,
    ],
    exports     : [
        ChatPanelComponent
    ],
    entryComponents: [
        LinechatLoginDialogComponent
    ]
})
export class ChatPanelModule
{
}
