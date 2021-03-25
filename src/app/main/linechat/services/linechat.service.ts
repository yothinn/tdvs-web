import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { Observable, Subject,  } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

// TODO : user can setting chatroomid , not fix at environment

export const LINECHAT_EVENT = {
	QRCODE_WAIT : 'qrcodeWait',
	PINCODE_WAIT : 'pincodeWait',
	SSE_TOKEN: 'sseToken',
	LOGIN_SUCCESS: 'loginSuccess',
	NOT_ADMIN: 'notAdmin',
	ERROR: 'error',
	LOGOUT: 'logout',
	OPENCHAT_PANEL: 'openChatPanel'
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
		setNickname: `${environment.linechatUrl}/api/linechat/nickname`,
		getProfile: `${environment.linechatUrl}/api/linechat/profile`,
		// Use proxy to convert
		chatStream: '/api/v1/sse',
		// https://chat-streaming-api.line.biz/api/v1/sse?token=token&deviceToken=&deviceType=&clientType=PC&pingSecs=33&lastEventId=AXhEqgaJOUKmLB2Ug-bkAQ
	};

	private _evsLogin: EventSource;
	private _evsMessage: EventSource;

	qrcodeImg: any;								// base64 qrcode from server
	pincode: string;							// pincode for verify line login
	sseToken: any;
	cookieToken: any = null;
	xsrfToken: any = null;
	cookieDate;

	streamApiToken: any = null;
	chatRoomId: string;

	chatEvent$ = new Subject<any>();

	constructor(
		private auth: AuthenService,
		private http: HttpClient,
	) {
		// this.cookieToken = 'csz7MvRvNEpwz+fAPUwFD/R++ednbBJdq/OM0HczpeMnWibRQIBdRnEVFgXiiwXzNJwEHfQnXo+4mLynLmxA2xghiJ2d3nZv8p0HTC1ums7AHbKPtKkgv+QH8tqcNmrCVXteReNPoYb4GEGRB3DP7nxoWE8Bm9f840YPIKwcJ4z/KVWWgsDqARa5o/6Urq3z+U9n/Y3WToyVygIQ9yIjVlSSazegGlC2FltpA8P4FF1lorl/xY+Js3Lh+iDDC+pwCn8EPO6A14mOwV4JWeES+m34EoipLR8/0YEL+YpCuUZCz7B2T8brpmtFJTKh2zhsm/G7Fb8zzjunWVdKvvyIxkueLlZOO6dl3yJUW2ssNxylTqeU0EHPqRdHIizFvnL0a8sdvaaaSJ6iPDcmR7N9IQ==';
		// this.xsrfToken = 'd641c302-86fc-4834-864f-946bc45cf655';
		
		this.getLocalStorage();
		// Reload login when new day
		let tmpDate = new Date(parseInt(this.cookieDate));
		let curDate = new Date(Date.now());
		// console.log(tmpDate);
		// console.log(curDate);
		if ((tmpDate.getMonth() !== curDate.getMonth()) || (tmpDate.getDate() !== curDate.getDate())) {
			this.cookieToken = null;
			this.xsrfToken = null;
		}
	}

	isLogin(): boolean {
		return this.cookieToken !== null;
	}

	getIconUrl(iconHash): string {
		return 'https://profile.line-scdn.net/' + iconHash + '/preview';
	}

	getChatEvent(): Observable<any> {
		return this.chatEvent$.asObservable();
	}

	selectChatRoomById(chatRoomId) {
		this.chatRoomId = chatRoomId;
	}

	login(): Observable<any> {
		return new Observable(subscriber => {
			// console.log(this.linechatUri.login);
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

			this._evsLogin.addEventListener(LINECHAT_EVENT.QRCODE_WAIT, (e: any) => {
				// console.log('listener qrCode wait');
				// console.log(e.data);
				// this.qrcodeImg = e.data;
				//this.qrcodeImg = `data:image/png;base64, ${e.data}`;
				// this._sseLogin$.next(LINECHAT_STATE.QRCODE_WAIT);
				subscriber.next(e);
			});

			this._evsLogin.addEventListener(LINECHAT_EVENT.PINCODE_WAIT, (e: any) => {
				// console.log("pincode wait");
				// console.log(e);
				// this.pincode = e.data;
				// this._sseLogin$.next(LINECHAT_STATE.PINCODE_WAIT);
				subscriber.next(e);
			})

			this._evsLogin.addEventListener(LINECHAT_EVENT.SSE_TOKEN, (e: any) => {
				// console.log("sse token");
				// console.log(e.data);
				this.sseToken = JSON.parse(e.data);
				this.setCookie(this.sseToken);
				// this._sseLogin$.next(LINECHAT_STATE.SSE_TOKEN);
				subscriber.next(e);
			})

			this._evsLogin.addEventListener(LINECHAT_EVENT.LOGIN_SUCCESS, (e:any) => {
				// console.log("login success");
				// console.log(e);
				// check if you are admin or not ?
				this._evsLogin.close();

				this.getChatRoomList().subscribe(list => {
					// console.log('check admin');
					// console.log(list);
					let chatRoom: any[] = list.filter(item => item.botId === this.chatRoomId);
					// console.log(chatRoom);
					// console.log(chatRoom.length);
					let isAdmin = chatRoom.length > 0 ? true : false;
					if (isAdmin) {
						// console.log('complete login');
						this.setLocalStorage();
						this.chatEvent$.next({
							type: LINECHAT_EVENT.LOGIN_SUCCESS
						});
					} else {
						e.type = LINECHAT_EVENT.NOT_ADMIN;
						// Reset cookie;
						this.logout();	
					}

					subscriber.next(e);
					subscriber.complete();
					
				});	
			});
		})
	}

	logout() {
		// TODO : logout to line server
		// Reset local storage
		this.sseToken = null;
		this.cookieToken = null;
		this.xsrfToken = null;
		this.removeLocalStorage();
		this.chatEvent$.next({
			type: LINECHAT_EVENT.LOGOUT
		});
	}

	setCookie(sseToken) {
		for (let i of sseToken) {
			switch (i.name) {
				case 'XSRF-TOKEN':
					if (i.domain === 'chat.line.biz') {
						this.xsrfToken = i.value;
					}
					break;
				case 'ses':
					this.cookieToken = i.value;
					break;
			}
		}

		// TODO
		// set to local storage;

		// console.log(this.xsrfToken);
		// console.log(this.cookieToken);
	}

	setLocalStorage() {
		window.localStorage.setItem(`cookieToken@${environment.appName}`, this.cookieToken);
		window.localStorage.setItem(`xsrfToken@${environment.appName}`, this.xsrfToken);
		window.localStorage.setItem(`cookieDate@${environment.appName}`, `${Date.now()}`);
		window.localStorage.setItem(`chatRoomId@${environment.appName}`, `${this.chatRoomId}`);
	}

	getLocalStorage() {
		this.cookieToken = window.localStorage.getItem(`cookieToken@${environment.appName}`);
		this.xsrfToken = window.localStorage.getItem(`xsrfToken@${environment.appName}`);
		this.cookieDate = window.localStorage.getItem(`cookieDate@${environment.appName}`);
		this.chatRoomId = window.localStorage.getItem(`chatRoomId@${environment.appName}`);
	}

	removeLocalStorage() {
		window.localStorage.removeItem(`cookieToken@${environment.appName}`);
		window.localStorage.removeItem(`xsrfToken@${environment.appName}`);
		window.localStorage.removeItem(`cooketDate@${environment.appName}`);
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
	getChatRoomList(noFilter = null, limit = 50): Observable<any>{
		let opt = {
			headers: this.auth.getAuthorizationHeader()
		}

		let body = {
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
			limit: limit,
		}

		if (noFilter) {
			body['noFilter'] = noFilter;
		}

		// console.log(body);

		return this.http.post(this.linechatUri.chatRoomList, body, opt)
					.pipe(map((v:any) => v.data.list));
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

		console.log(body);
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
							// console.log(this.streamApiToken);
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
				// let chatStreamUri = `${this.linechatUri.streamApiToken}` +
				let chatStreamUri = '/api/v1/sse' + 
					`?token=${data.streamingApiToken}&deviceToken=&deviceType=&clientType=PC&pingSecs=20&lastEventId=${data.lastEventId}`;
				
				// console.log(chatStreamUri);
				this._evsMessage = new EventSource(chatStreamUri);

				this._evsMessage.addEventListener("chat", event => {
					// console.log(event)
					subscriber.next(event);
				});
			
				this._evsMessage.onmessage = event => {
					// console.log(event);
					subscriber.next(event);
					
				};
			
				this._evsMessage.onerror = error => {
					// console.log(error);	
					subscriber.error(error);
				};
			})
		});
	}


	setNickname(chatId, nickname) {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			chatId: chatId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
			message: {
				nickname: nickname
			} 
		};

		console.log(body);

		return this.http.post(this.linechatUri.setNickname, body, opt);
	}

	getProfile(chatId): Observable<any> {
		let opt = {
			headers: this.auth.getAuthorizationHeader(),
		}

		let body = {
			chatRoomId: this.chatRoomId,
			cookieToken: this.cookieToken,
			xsrfToken: this.xsrfToken,
			chatId: chatId,
		};

		return this.http.post(this.linechatUri.getProfile, body, opt)
					.pipe(map((v: any) => v.data));
	}


	openChatPanel(chatId) {
		this.chatEvent$.next({
			type: LINECHAT_EVENT.OPENCHAT_PANEL,
			chatId: chatId,
		});
	}

}
