import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JoborderService } from '../joborder/services/joborder.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  routeParams: any;

  constructor(
    private joborder: JoborderService,  
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    // console.log("resolve with params : " + JSON.stringify(this.routeParams));

    // route : report/joborder/:id
    if (this.routeParams.id) {
      return this.joborder.getJoborderData(this.routeParams.id);
    } 
    return '';
    // else {
    //   return this.getJoborderDataList(0, 10, "", "created", "desc");
    // }
  }
}
