import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { of, Subject, from } from 'rxjs';
import { takeUntil, map, expand, tap, concatAll } from 'rxjs/operators';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatPanelService } from 'app/layout/components/chat-panel/chat-panel.service';
import { LinechatService } from 'app/main/linechat/services/linechat.service';

@Component({
    selector     : 'chat-panel',
    templateUrl  : './chat-panel.component.html',
    styleUrls    : ['./chat-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatPanelComponent implements OnInit, AfterViewInit, OnDestroy
{
    contacts: any[];
    chat: any;
    selectedContact: any;
    sidebarFolded: boolean;
    user: any;

    @ViewChild('replyForm')
    set replyForm(content: NgForm)
    {
        this._replyForm = content;
    }

    @ViewChild('replyInput')
    set replyInput(content: ElementRef)
    {
        this._replyInput = content;
    }

    @ViewChildren(FusePerfectScrollbarDirective)
    private _fusePerfectScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private _chatViewScrollbar: FusePerfectScrollbarDirective;
    private _replyForm: NgForm;
    private _replyInput: ElementRef;
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatPanelService} _chatPanelService
     * @param {HttpClient} _httpClient
     * @param {FuseSidebarService} _fuseSidebarService
     */
    constructor(
        // TODO : Comment later, convert to line chat service
        private _chatPanelService: ChatPanelService,
        private _httpClient: HttpClient,
        private _fuseSidebarService: FuseSidebarService,
        private _linechatService: LinechatService,
    )
    {
        // Set the defaults
        this.selectedContact = null;
        this.sidebarFolded = true;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Load the contacts
        // this._chatPanelService.loadContacts().then(() => {

        //     this.contacts = this._chatPanelService.contacts;
        //     this.user = this._chatPanelService.user;
        // });
        this._linechatService.selectChatRoomById('U9b2714c1a2fa39646c1bb25e674aa0b3');
        this._linechatService.getUserList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((userList: any) => {
                this.contacts = userList;
            });
        
        // Subscribe to the foldedChanged observable
        this._fuseSidebarService.getSidebar('chatPanel').foldedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((folded) => {
                this.sidebarFolded = folded;
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        this._chatViewScrollbar = this._fusePerfectScrollbarDirectives.find((directive) => {
            return directive.elementRef.nativeElement.id === 'messages';
        });

        this._linechatService.openChatStreaming().subscribe(e => {
            // TODO: receive event should reload contactlist if not selected
            // if selected should ?
            // For test only
            let msg = JSON.parse(e.data);
            console.log(msg);
            this.chat.dialog.list.push({
                type: msg.subEvent,
                timestamp: msg.timestamp,
                source: msg.payload.source,
                sendId: msg.payload.sendId,
                message: msg.payload.message
            });
        })
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prepare the chat for the replies
     */
    private _prepareChatForReplies(): void
    {
        setTimeout(() => {

            // Focus to the reply input
            // this._replyInput.nativeElement.focus();

            // Scroll to the bottom of the messages list
            if ( this._chatViewScrollbar )
            {
                this._chatViewScrollbar.update();

                setTimeout(() => {
                    this._chatViewScrollbar.scrollToBottom(0);
                });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fold the temporarily unfolded sidebar back
     */
    foldSidebarTemporarily(): void
    {
        this._fuseSidebarService.getSidebar('chatPanel').foldTemporarily();
    }

    /**
     * Unfold the sidebar temporarily
     */
    unfoldSidebarTemporarily(): void
    {
        this._fuseSidebarService.getSidebar('chatPanel').unfoldTemporarily();
    }

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpen(): void
    {
        this._fuseSidebarService.getSidebar('chatPanel').toggleOpen();
    }

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean
    {
        // return (
        //     message.who === this.selectedContact.id &&
        //     ((this.chat.dialog[i + 1] && this.chat.dialog[i + 1].who !== this.selectedContact.id) || !this.chat.dialog[i + 1])
        // );
        return this.chat.dialog.list[i].type === 'message';
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean
    {
        // return (i === 0 || this.chat.dialog[i - 1] && this.chat.dialog[i - 1].who !== message.who);
        return (i === 0 || this.chat.dialog.list[i - 1] && this.chat.dialog.list[i -1].type !== 'messageSent')
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean
    {
        // return (i === this.chat.dialog.length - 1 || this.chat.dialog[i + 1] && this.chat.dialog[i + 1].who !== message.who);
        return (i === this.chat.dialog.list.length - 1 || this.chat.dialog.list[i + 1] && this.chat.dialog.list[i + 1].type !== 'messageSent');
    }

    /**
     * Toggle chat with the contact
     *
     * @param contact
     */
    toggleChat(contact): void
    {
        // If the contact equals to the selectedContact,
        // that means we will deselect the contact and
        // unload the chat
        if ( this.selectedContact && contact.chatId === this.selectedContact.chatId )
        {
            // Reset
            this.resetChat();
        }
        // Otherwise, we will select the contact, open
        // the sidebar and start the chat
        else
        {
            // Unfold the sidebar temporarily
            this.unfoldSidebarTemporarily();

            // Set the selected contact
            this.selectedContact = contact;

            // Load the chat
            // this._chatPanelService.getChat(contact.id).then((chat) => {

            //     // Set the chat
            //     this.chat = chat;

            //     // Prepare the chat for the replies
            //     this._prepareChatForReplies();
            // });
            this._linechatService.getHistoryMessage(contact.chatId)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(msg => {
                    msg.list.reverse();
                    this.chat = {
                        id: contact.chatId,
                        dialog: msg
                    }

                    this._prepareChatForReplies();
                    console.log(this.chat);
                })
        }
    }

    /**
     * Remove the selected contact and unload the chat
     */
    resetChat(): void
    {
        // Set the selected contact as null
        this.selectedContact = null;

        // Set the chat as null
        this.chat = null;
    }

    /**
     * Reply
     */
    reply(event): void
    {
        event.preventDefault();

        if ( !this._replyForm.form.value.message )
        {
            return;
        }

        this._linechatService.sendMessage(this.selectedContact.chatId, this._replyForm.form.value.message)
            .subscribe(v => {
                this._prepareChatForReplies();
                
                console.log(v);
            });
        this._replyForm.reset();

        // // Message
        // const message = {
        //     who    : this.user.id,
        //     message: this._replyForm.form.value.message,
        //     time   : new Date().toISOString()
        // };

        // // Add the message to the chat
        // this.chat.dialog.push(message);

        // // Reset the reply form
        // this._replyForm.reset();

        // // Update the server
        // this._chatPanelService.updateChat(this.chat.id, this.chat.dialog).then(response => {

        //     // Prepare the chat for the replies
        //     this._prepareChatForReplies();
        // });
    }

    scrolled(event) {
        console.log(event);
    }

    getAvatar(iconHash): string {
        return this._linechatService.getIconUrl(iconHash);
    }

}
