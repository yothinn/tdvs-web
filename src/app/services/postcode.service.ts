import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

const API_POSTCODE_URI = environment.apiUrl + '/api/postcodes';
const API_PROVINCES_URI = environment.apiUrl + '/api/provinces';


@Injectable({
	providedIn: 'root'
})
export class PostcodeService {

	postcodeList: any[] = [];

	constructor(
		private auth: AuthenService,
		private http: HttpClient,
	) {

	}

	resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
		// this.routeParams = route.params;
		// console.log("resolve with params : " + JSON.stringify(this.routeParams));
		return this.getPostcodeList().pipe(
			map(res => {
				this.postcodeList = res.data;
				return res.data;
			})
		);
	}

	/**
	 * get postcode list from service
	 * @returns {Observable} data receive from service
	 */
	getPostcodeList(): Observable<any> {
		return this.http.get(API_POSTCODE_URI, { headers: this.auth.getAuthorizationHeader() });
	}

	/**
	 * @param {string} txt : string text that want to filter
	 * @returns {json} filter data , district, subdistrict, province, postcode
	 */
	filter(txt): any[] {
		return this.postcodeList.filter(data => {
			return data.postcode.startsWith(txt);
		});
	}

	getProvincesList(name: string="all"): Observable<any> {
		let apiRoute = `${API_PROVINCES_URI}/${name}`
		return this.http.get(apiRoute, {headers: this.auth.getAuthorizationHeader() } );
	}
}
