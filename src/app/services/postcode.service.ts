import { Injectable } from '@angular/core';
import { AuthenService } from 'app/authentication/authen.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_POSTCODE_URI = environment.apiUrl + "/api/postcodes";


@Injectable({
  providedIn: 'root'
})
export class PostcodeService {

  postcodeList: any[];

  constructor(
    private auth: AuthenService,
    private http: HttpClient,
  ) {
    this.getPostcodesList().subscribe(
      res => {
        this.postcodeList = res.data;
        console.log(this.postcodeList);
      },
      err => {
        // TODO : throw error,
      }
    );
  }

  /**
   * get postcode list from service
   * @returns {Observable} data receive from service
   */
  getPostcodesList(): Observable<any> {
    return this.http.get(API_POSTCODE_URI, {headers: this.auth.getAuthorizationHeader()});
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
}
