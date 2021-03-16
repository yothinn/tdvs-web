import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export const LINECHAT_STATE = {
	QRCODE_WAIT : 'qrcodeWait',
	PINCODE_WAIT : 'pincodeWait',
	SSE_TOKEN: 'sseToken',
	SUCCESS: 'loginSuccess',
	ERROR: 'error'
};


@Injectable({
	providedIn: 'root'
})
export class LinechatService {

	readonly linechatUri = {
		login: `${environment.linechatUrl}/api/linechat/login`,
		chatRoomList : `${environment.linechatUrl}/api/linechat/chatRoomList`,
		userList: `${environment.linechatUrl}/api/linechat/userList`,
		historyMessage: `${environment.linechatUrl}/api/linechat/historyMessage`,
		sendMessage: `${environment.linechatUrl}/api/linechat/sendMessage`,
		streamApiToken: `${environment.linechatUrl}/api/linechat/streamApiToken`,
	};

	evsLogin: EventSource;
	evsMessage: EventSource;

	qrcodeImg: any;								// base64 qrcode from server
	pincode: string;							// pincode for verify line login
	sseToken: any;

	private sseLogin$ = new Subject<string>();
	private sseMessage$ = new Subject<any>();

	constructor(
		private auth: AuthenService,
		private http: HttpClient,
	) {

	}

	getSseLogin(): Observable<any> {
		return this.sseLogin$.asObservable();
	}

	geSseMessage(): Observable<any> {
		return this.sseMessage$.asObservable();
	}

	login(): void {

		try {

			this.evsLogin = new EventSource(this.linechatUri.login);

			this.evsLogin.onopen = function(e) {
				console.log("open sse connection");
				console.log(e);
			}

			this.evsLogin.onmessage = function(e) {
				console.log("receive message");
				console.log(e);
			}

			this.evsLogin.onerror = (e) => {
				console.log("error message");
				console.log(e);
				this.sseLogin$.next(LINECHAT_STATE.ERROR);
				this.evsLogin.close();
			}

			this.evsLogin.addEventListener(LINECHAT_STATE.QRCODE_WAIT, (e: any) => {
				console.log('listener qrCode wait');
				console.log(e.data);
				this.qrcodeImg = e.data;
				this.sseLogin$.next(LINECHAT_STATE.QRCODE_WAIT);
			})

			this.evsLogin.addEventListener(LINECHAT_STATE.PINCODE_WAIT, (e: any) => {
				console.log("pincode wait");
				console.log(e);
				this.pincode = e.data;
				this.sseLogin$.next(LINECHAT_STATE.PINCODE_WAIT);
			})

			this.evsLogin.addEventListener(LINECHAT_STATE.SSE_TOKEN, (e: any) => {
				console.log("sse token");
				console.log(e);
				this.sseToken = e.data;
				this.sseLogin$.next(LINECHAT_STATE.SSE_TOKEN);
			})

			this.evsLogin.addEventListener(LINECHAT_STATE.SUCCESS, (e) => {
				console.log("login success");
				console.log(e);
				this.evsLogin.close();
				this.sseLogin$.next(LINECHAT_STATE.SUCCESS);
			});

		} catch(error) {

			this.evsLogin.close();
			throw error;
		}
	}

	getChatRoomList(){

	}

	getUserList() {

	}

	getHistoryMessage() {

	}

	sendMessage() {

	}



}
