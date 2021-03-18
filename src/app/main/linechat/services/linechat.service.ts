import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject,  } from 'rxjs';
import { map } from 'rxjs/operators';


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
		chatStream: 'https://chat-streaming-api.line.biz/api/v1/sse',
		// https://chat-streaming-api.line.biz/api/v1/sse?token=token&deviceToken=&deviceType=&clientType=PC&pingSecs=33&lastEventId=AXhEqgaJOUKmLB2Ug-bkAQ
	};

	private _evsLogin: EventSource;
	private _evsMessage: EventSource;

	qrcodeImg: any;								// base64 qrcode from server
	pincode: string;							// pincode for verify line login
	sseToken: any;
	cookieToken: any = null;
	xsrfToken: any = null

	streamApiToken: any = null;
	chatRoomId: string;

	// private _sseLogin$ = new Subject<string>();
	// private _sseMessage$ = new Subject<any>();

	constructor(
		private auth: AuthenService,
		private http: HttpClient,
	) {
		this.cookieToken = 'T0sa4cv1PzSkbI9DTJ/yy6hfICpT9z7LY06QYz4Mw9AXsRWakLA1qCWjSeMcwZ/6LCf3raa7kXwoin8XAkzTS79GUQFNWk+HltSqQgte4N8ji7R/wobs/eC9XUsq6704uicnfo1v6mj0QzuNiamOrCNOJsqawlWykABE3/PcC/KL0KDVfYg+oBAr2UIXxOyMnrL5exHuA6Jm/r93cdPdXAhiV4LtPE2oG/6oUe99IzBBen8ZswoKy9AJGRs5YwCqibCoQUGfl04Hw5nv8ltGHiCLKrINU9nsDmMR15zb8VIUmTdRK01sABn5InjzNCTGMoGv7KB1dcQkHBeub99qe05MLfk/ZEFYtMYAceMuXrqaJ9d02JY/dx/ohxafnMKs';
		this.xsrfToken = '81f4c3d2-ace2-49f5-8033-cde36e992b40';
	}

	isLogin(): boolean {
		return this.cookieToken !== null;
	}

	getIconUrl(iconHash): string {
		return 'https://profile.line-scdn.net/' + iconHash + '/preview';
	}

	selectChatRoomById(chatRoomId) {
		this.chatRoomId = chatRoomId;
	}

	// getSseLogin(): Observable<any> {
	// 	return this._sseLogin$.asObservable();
	// }

	// getSseMessage(): Observable<any> {
	// 	return this._sseMessage$.asObservable();
	// }

	login(): Observable<any> {
		return new Observable(subscriber => {
			this._evsLogin = new EventSource(this.linechatUri.login);

			// this.evsLogin.onopen = function(e) {
			// 	console.log("open sse connection");
			// 	console.log(e);
			// }

			// this.evsLogin.onmessage = function(e) {
			// 	console.log("receive message");
			// 	console.log(e);
			// }

			this._evsLogin.onerror = (e) => {
				// console.log("error message");
				// console.log(e);
				// this._sseLogin$.next(LINECHAT_STATE.ERROR);
				this._evsLogin.close();
				subscriber.error(e);
			};

			this._evsLogin.addEventListener(LINECHAT_STATE.QRCODE_WAIT, (e: any) => {
				// console.log('listener qrCode wait');
				// console.log(e.data);
				// this.qrcodeImg = e.data;
				//this.qrcodeImg = `data:image/png;base64, ${e.data}`;
				// this._sseLogin$.next(LINECHAT_STATE.QRCODE_WAIT);
				subscriber.next(e);
			});

			this._evsLogin.addEventListener(LINECHAT_STATE.PINCODE_WAIT, (e: any) => {
				// console.log("pincode wait");
				// console.log(e);
				// this.pincode = e.data;
				// this._sseLogin$.next(LINECHAT_STATE.PINCODE_WAIT);
				subscriber.next(e);
			})

			this._evsLogin.addEventListener(LINECHAT_STATE.SSE_TOKEN, (e: any) => {
				console.log("sse token");
				// console.log(e.data);
				this.sseToken = e.data;
				this.setCookie(this.sseToken);
				// this._sseLogin$.next(LINECHAT_STATE.SSE_TOKEN);
				subscriber.next(e);
			})

			this._evsLogin.addEventListener(LINECHAT_STATE.SUCCESS, (e) => {
				// console.log("login success");
				// console.log(e);
				this._evsLogin.close();
				// this._sseLogin$.next(LINECHAT_STATE.SUCCESS);
				subscriber.complete();
			});
		})
	}

	setCookie(sseToken) {
		let c = '';
		for (let i of sseToken) {
			switch (i.name) {
				case 'XSRF-TOKEN':
					if (i.domain === 'chat.line.biz') {
						this.xsrfToken = i.value;
					}
				case 'ses':
					this.cookieToken = i.value;
			}
		}
		console.log(this.xsrfToken);
		console.log(this.cookieToken);
	}

	/**
	 * 
	 * @param body 
	 * {
	 * 	noFilter : true/false
	 *  limit : default 50
	 * }
	 * when empty default server is noFilter: true, limit: 50
	 * @returns 
	 */
	getChatRoomList(body = {}): Observable<any>{
		let opt = {
			headers: this.auth.getAuthorizationHeader()
		}

		body['cookieToken'] = this.cookieToken;
		body['xsrfToken'] = this.xsrfToken;

		console.log(body);

		return this.http.post(this.linechatUri.chatRoomList, body, opt);
	}

	/**
	 * 
	 * @param body 
	 * {
	 *  chatRoomId:
 	 *  folderType: default ALL
 	 *  tagIds:
 	 *  limit:  default 25
 	 *  nextToken: 
	 * }
	 * @returns 
	 */
	getUserList(folderType = null, tagIds = null, limit = 25, nextToken=null): Observable<any> {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
			limit: limit,
		}

		if (folderType) {
			body['folderType'] = folderType;
		}

		if (tagIds) {
			body['tageIds'] = tagIds;
		}

		if (nextToken) {
			body['nextToken'] = nextToken;
		}

		console.log(body);

		return this.http.post(this.linechatUri.userList, body, opt)
					.pipe(map((value: any) => value.data.list));
	}

	/**
	 * 
	 * @param chatId 
	 * @param backwardToken : token for request message
	 * @returns 
	 */
	getHistoryMessage(chatId, backwardToken = null): Observable<any> {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			chatId: chatId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
		}

		if (backwardToken) {
			body['backwardToken'] = backwardToken;
		}

		return this.http.post(this.linechatUri.historyMessage, body, opt)
					.pipe(map((value:any) => value.data));
	}

	/**
	 * 
	 * @param chatId 
	 * @param message 
	 * @returns 
	 */
	sendMessage(chatId, message): Observable<any> {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			chatId: chatId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
			message: {
				sendId: chatId + '_' + Date.now(),
				text: message,
				type: 'text',
			}
		}

		return this.http.post(this.linechatUri.sendMessage, body, opt);
	}

	/**
	 * get stream api token from chat romm that selected
	 * call selectChatRoomById(id) in first time
	 * @returns 
	 */
	getStreamApiToken(): Observable<any> {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
		}

		return this.http.post(this.linechatUri.streamApiToken, body, opt)
					.pipe(
						map((v: any) => {
							this.streamApiToken = v.data;
							console.log(this.streamApiToken);
							return this.streamApiToken;
						})
					);
	}


	/**
	 * 
	 */
	openChatStreaming(): Observable<any> {
		return new Observable(subscriber => {
			this.getStreamApiToken().subscribe(data => {
				// https://chat-streaming-api.line.biz/api/v1/sse?token=token&deviceToken=&deviceType=&clientType=PC&pingSecs=33&lastEventId=AXhEqgaJOUKmLB2Ug-bkAQ
				let chatStreamUri = '/api/v1/sse' + 
					`?token=${data.streamingApiToken}&deviceToken=&deviceType=&clientType=PC&pingSecs=20&lastEventId=${data.lastEventId}`;
				
				console.log(chatStreamUri);
				this._evsMessage = new EventSource(chatStreamUri);

				this._evsMessage.addEventListener("chat", event => {
					console.log(event)
					subscriber.next(event);
				});
			
				this._evsMessage.onmessage = event => {
					console.log(event);
					subscriber.next(event);
					
				};
			
				this._evsMessage.onerror = error => {
					console.log(error);	
					subscriber.error(error);
				};
			})
		});
	}

}
