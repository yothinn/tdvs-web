import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { LINECHAT_EVENT, LinechatService } from '../services/linechat.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
	selector: 'app-linechat-login-dialog',
	templateUrl: './linechat-login-dialog.component.html',
	styleUrls: ['./linechat-login-dialog.component.scss']
})
export class LinechatLoginDialogComponent implements OnInit, OnDestroy {

	private _unsubscribeAll: Subject<any>;
	qrcodeImg: any = null;
	pincode: string = '';
	state: string = '';

	chatRoomList: any[] = null;
	selectedChatRoom = null;
	chatRoomId = null;

	loginTimer = 120000;
	countDownTimer;

	intervalId;

	isLoading = true;
	isReload = false;
	isAdmin = true;

	isChangeChatRoom = false;

	constructor(
		private lineService: LinechatService,
		public dialogRef: MatDialogRef<LinechatLoginDialogComponent>,
		private sanitizer:DomSanitizer,
		private _ref: ChangeDetectorRef,
	) {
		this._unsubscribeAll = new Subject<any>();
	}

	ngOnInit() {

		// this.lineService.selectChatRoomById(environment.thamDeliveryChatRoomId);

		this.isLoading = true;
		this.login();
	}

	ngOnDestroy() {
		clearInterval(this.intervalId);
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	login() {
		this.lineService.login()
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe({
				next: e => {
					this.state = e.type;
					// console.log(this.state);
					if (e.type === LINECHAT_EVENT.QRCODE_WAIT) {
						this.isLoading = false;
						this.qrcodeImg = e.data;
						// console.log(this.qrcodeImg);
					}

					if (e.type === LINECHAT_EVENT.PINCODE_WAIT) {
						this.startTimer();
						this.pincode = e.data;
						// console.log(this.pincode);
					}

					if (e.type === LINECHAT_EVENT.LOGIN_SUCCESS) {
						// 	console.log('login success');
						// User want to change chat room
						if (this.isChangeChatRoom) {
							this.lineService.chatRoomId = null;
						}
						
						this.selectChatRoom();
					}

					this._ref.detectChanges();
				},
				error: (err) => {
					clearInterval(this.intervalId);
					// console.log('error login');
					this.state = '';
					this.isReload = true;
					this.isLoading = false;
					this._ref.detectChanges();
				},
				complete: () => {
					clearInterval(this.intervalId);
					// this.dialogRef.close();
				}
			});
	}

	reloadLogin() {
		this.isReload = false;
		this.isLoading = true;
		this.login();
	}

	onCancel() {
		this.dialogRef.close()
	}

	getQrcodeImage() {
		return this.sanitizer.bypassSecurityTrustUrl(this.qrcodeImg);
	}

	isQrcodeWait(): boolean {
		return this.state === LINECHAT_EVENT.QRCODE_WAIT;
	}

	isPincodeWait(): boolean {
		return this.state === LINECHAT_EVENT.PINCODE_WAIT;
	}

	isLoginSuccess(): boolean {
		return this.state === LINECHAT_EVENT.LOGIN_SUCCESS;
	}

	startTimer(): void {
		// REMARK : when timeout, it has error event from server
		clearInterval(this.intervalId);

		this.countDownTimer = this.loginTimer;
	
		this.intervalId = setInterval(() => {
			this.countDownTimer -= 1000;

			this._ref.detectChanges();
		}, 1000);		
	}

	selectChatRoom() {
		this.lineService.getChatRoomList()
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe(v => {
				// console.log(v);
				this.chatRoomList = v;
				this.chatRoomId = this.lineService.chatRoomId;
				// console.log(chatRoomId);
				if (this.chatRoomId) {

					// Check is admin or not ?
					let chatRoom: any[] = this.chatRoomList.filter(item => item.botId === this.chatRoomId);
					this.isAdmin = (chatRoom.length > 0) ? true : false;
					let type;

					if (this.isAdmin) {
						type = LINECHAT_EVENT.SELECT_CHATROOM_SUCCESS;
						this.lineService.sendChatEvent(type);
						this.dialogRef.close();
					} else {
						type = LINECHAT_EVENT.NOT_ADMIN;
						this.lineService.logout();
						this.lineService.sendChatEvent(type);
					}
					
				}
				// if chatRoomId is null , display chatroom list that user select
				this._ref.detectChanges();
			});
	}

	onSelectChatRoom() {
		// console.log('chat room');
		// console.log(this.selectedChatRoom);

		if (this.chatRoomList.length === 0) {
			this.lineService.logout();
			this.dialogRef.close();
			return;
		}

		let chatRoom = this.chatRoomList.find(c => c.name === this.selectedChatRoom);
		// console.log(chatRoom);

		// Select chat room in line service and send to all subscribe
		this.lineService.chatRoomId = chatRoom.botId;
		this.lineService.sendChatEvent(LINECHAT_EVENT.SELECT_CHATROOM_SUCCESS);

		this.dialogRef.close();
	}
}
