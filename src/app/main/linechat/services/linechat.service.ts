import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { Observable, Subject,  } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


// TODO : user can setting chatroomid , not fix at environment

export const LINECHAT_EVENT = {
	QRCODE_WAIT : 'qrcodeWait',
	PINCODE_WAIT : 'pincodeWait',
	SSE_TOKEN: 'sseToken',
	LOGIN_SUCCESS: 'loginSuccess',
	SELECT_CHATROOM_SUCCESS: "selectChatRoomSuccess",
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
	private _chatRoomId: string = null;

	chatEvent$ = new Subject<any>();

	constructor(
		private auth: AuthenService,
		private http: HttpClient,
		private sanitizer:DomSanitizer,

	) {
		// this.cookieToken = 'csz7MvRvNEpwz+fAPUwFD/R++ednbBJdq/OM0HczpeMnWibRQIBdRnEVFgXiiwXzNJwEHfQnXo+4mLynLmxA2xghiJ2d3nZv8p0HTC1ums7AHbKPtKkgv+QH8tqcNmrCVXteReNPoYb4GEGRB3DP7nxoWE8Bm9f840YPIKwcJ4z/KVWWgsDqARa5o/6Urq3z+U9n/Y3WToyVygIQ9yIjVlSSazegGlC2FltpA8P4FF1lorl/xY+Js3Lh+iDDC+pwCn8EPO6A14mOwV4JWeES+m34EoipLR8/0YEL+YpCuUZCz7B2T8brpmtFJTKh2zhsm/G7Fb8zzjunWVdKvvyIxkueLlZOO6dl3yJUW2ssNxylTqeU0EHPqRdHIizFvnL0a8sdvaaaSJ6iPDcmR7N9IQ==';
		// this.xsrfToken = 'd641c302-86fc-4834-864f-946bc45cf655';
		
		this.getChatRoomIdLocalStorage();
		this.getCookieLocalStorage();
		
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

	// Getter/Setter chatroomId
	public get chatRoomId() {
		return this._chatRoomId;
	}

	public set chatRoomId(id) {
		this._chatRoomId = id;

		if (id) {
			// Set to localstorage
			this.setChatRoomIdLocalStorage();
		} else {
			this.clearChatRoomIdLocalStorage();
		}
	}

	isLogin(): boolean {
		return this.cookieToken !== null;
	}

	getIconUrl(iconHash): string {
		if (!iconHash) {
			return 'https://obs.line-scdn.net/0h9PsefvzeZn9OHE_fZ9EZKHJZaBI5MmA3Nn0qGGkfbUpiJCkrJS4hTDkdOEw3LSZ5di15HWpMak5k';
		}
		return 'https://profile.line-scdn.net/' + iconHash + '/preview';
	}

	getImageUrl(contentHash): string {
		let uri = `https://chat-content.line-scdn.net/bot/${this.chatRoomId}/${contentHash}/preview`;
		//return this.sanitizer.bypassSecurityTrustUrl(uri);
		return uri;
	}

	// getStickerUrl(stickerId): string {
	// 	https://stickershop.line-scdn.net/stickershop/v1/sticker/52002739/ANDROID/sticker.png
	// 	let uri = `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerId}/ANDROID/sticker.png`;
	// 	//return this.sanitizer.bypassSecurityTrustUrl(uri);
	// 	return uri;
	// }


	getChatEvent(): Observable<any> {
		return this.chatEvent$.asObservable();
	}

	sendChatEvent(type, data:any = null) {
		this.chatEvent$.next({
			type: type,
			data: data
		});
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
				// console.log(e);
				this._evsLogin.close();
				subscriber.error(e);
			};

			this._evsLogin.addEventListener(LINECHAT_EVENT.QRCODE_WAIT, (e: any) => {
				// console.log(e.data);
				subscriber.next(e);
			});

			this._evsLogin.addEventListener(LINECHAT_EVENT.PINCODE_WAIT, (e: any) => {
				// console.log(e);
				subscriber.next(e);
			});

			this._evsLogin.addEventListener(LINECHAT_EVENT.SSE_TOKEN, (e: any) => {
				// console.log(e.data);
				this.sseToken = JSON.parse(e.data);
				this.setCookie(this.sseToken);
				subscriber.next(e);
			});

			this._evsLogin.addEventListener(LINECHAT_EVENT.LOGIN_SUCCESS, (e:any) => {
				// console.log(e);
				this._evsLogin.close();
				this.setCookieLocalStorage();
				subscriber.next(e);
				subscriber.complete();
			});
		})
	}

	logout() {
		// TODO : logout to line server
		// Reset local storage
		this.sseToken = null;
		this.cookieToken = null;
		this.xsrfToken = null;
		this.clearCookieLocalStorage();

		this.sendChatEvent(LINECHAT_EVENT.LOGOUT);
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
	}

	private setCookieLocalStorage() {
		window.localStorage.setItem(`cookieToken@${environment.appName}`, this.cookieToken);
		window.localStorage.setItem(`xsrfToken@${environment.appName}`, this.xsrfToken);
		window.localStorage.setItem(`cookieDate@${environment.appName}`, `${Date.now()}`);
	}

	private getCookieLocalStorage() {
		this.cookieToken = window.localStorage.getItem(`cookieToken@${environment.appName}`);
		this.xsrfToken = window.localStorage.getItem(`xsrfToken@${environment.appName}`);
		this.cookieDate = window.localStorage.getItem(`cookieDate@${environment.appName}`);
		
	}

	clearCookieLocalStorage() {
		window.localStorage.removeItem(`cookieToken@${environment.appName}`);
		window.localStorage.removeItem(`xsrfToken@${environment.appName}`);
		window.localStorage.removeItem(`cookieDate@${environment.appName}`);
	}

	private getChatRoomIdLocalStorage() {
		this.chatRoomId = window.localStorage.getItem(`chatRoomId@${environment.appName}`);
	}

	private setChatRoomIdLocalStorage() {
		window.localStorage.setItem(`chatRoomId@${environment.appName}`, this.chatRoomId);
	}

	clearChatRoomIdLocalStorage() {
		window.localStorage.removeItem(`chatRoomId@${environment.appName}`);
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
	getUserList({folderType =null, tagIds = null, limit=25, nextToken =null} = {}): Observable<any> {
		// console.log(nextToken);
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

		// console.log(body);

		return this.http.post(this.linechatUri.userList, body, opt)
					.pipe(map((value:any) => value.data));
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
