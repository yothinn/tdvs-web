import { Component, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { LINECHAT_STATE, LinechatService } from '../services/linechat.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


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

	loginTimer = 120000;

	intervalId;

	constructor(
		private lineService: LinechatService,
		public dialogRef: MatDialogRef<LinechatLoginDialogComponent>,
		private sanitizer:DomSanitizer,
		private _ref: ChangeDetectorRef,
	) {
		this._unsubscribeAll = new Subject<any>();
		// this.qrcodeImg = 'data:image/png;base64, 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';
		// this.pincode = '1234';
	}

	ngOnInit() {
		// this.state='pincodeWait';
		// this.startTimer();

		this.lineService.login()
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe({
				next: e => {
					console.log(e)
					this.state = e.type;
					console.log(this.state);
					if (e.type === LINECHAT_STATE.QRCODE_WAIT) {
						this.qrcodeImg = e.data;
						// console.log(this.qrcodeImg);
					}

					if (e.type === LINECHAT_STATE.PINCODE_WAIT) {
						this.startTimer();
						this.pincode = e.data;
						console.log(this.pincode);
					}
	
					// if (e.type === LINECHAT_STATE.SUCCESS) {
					// 	console.log("login success:dialog close");
					// 	clearInterval(this.intervalId);
					// 	this.dialogRef.close();
					// }
				},
				error: (err) => {
					clearInterval(this.intervalId);
					console.log('error login');
				},
				complete: () => {
					this.state = LINECHAT_STATE.SUCCESS;
					clearInterval(this.intervalId);
					this.dialogRef.close();
					console.log('complete login');
				}
			});
	}

	ngOnDestroy() {
		clearInterval(this.intervalId);
		this._unsubscribeAll.next();
		this._unsubscribeAll.complete();
	}

	// onCancel() {
	// 	this.dialogRef.close()
	// }

	getQrcodeImage() {
		return this.sanitizer.bypassSecurityTrustUrl(this.qrcodeImg);
	}

	isQrcodeWait() {
		return this.state === LINECHAT_STATE.QRCODE_WAIT;
	}

	isPincodeWait() {
		return this.state === LINECHAT_STATE.PINCODE_WAIT;
	}

	startTimer() {
		this.intervalId = setInterval(() => {
			this.loginTimer -= 1000;
		}, 1000);
	}

}
