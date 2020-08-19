import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { JoborderService } from '../joborder/services/joborder.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "environments/environment";
import { AuthenService } from 'app/authentication/authen.service';
import * as moment from 'moment';

const SALES_REPORT_JOBORDER = `${environment.apiUrl}/api/report/sales/joborder`;
const SALES_REPORT_DATES = `${environment.apiUrl}/api/report/sales/dates`;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  routeParams: any;

  constructor(
    private http: HttpClient,
    private joborder: JoborderService,  
    private auth: AuthenService,
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    // console.log("resolve with params : " + JSON.stringify(this.routeParams));

    // console.log(route.url[0].path);

    const path = route.url[0].path;

    if (path === 'joborder') {
      // route : report/joborder/:id
      return this.routeParams.id ? this.joborder.getJoborderData(this.routeParams.id) : '';
    } else if (path === 'sales') {
      return '';
      //return this.getSalesReportByJoborder({page: 1});
    } else {
      return '';
    }
  }

    /**
   * Get sales report by Joborder 
   * return data report each 10 size per page
   * @param {json} 
   * JSON : {
   *  startDate: "UTC date "
   *  endDate: "UTC date"
   *  page: "number, 1 is default"
   *  size: "number, 10 is default"
   * }
   */
  getSalesReportByJoborder(body): Observable<any> {
    return this.http.post(SALES_REPORT_JOBORDER, body, { headers: this.auth.getAuthorizationHeader() });
  }

    /**
   * Get sales report by dates 
   * return data report each 10 size per page
   * @param {json} 
   * JSON : {
   *  startDate: "UTC date"
   *  endDate: "UTC date"
   *  page: "number, 1 is default"
   *  size: "number, 10 is default"
   * }
   */
  getSalesReportByDates(body): Observable<any> {
    return this.http.post(SALES_REPORT_DATES, body, { headers: this.auth.getAuthorizationHeader() });
  }
}
