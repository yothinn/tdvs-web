import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "environments/environment";

const api_url = environment.apiUrl + "/api/vehicles/";
const api_url_customer = environment.apiUrl + "/api/vehiclestaffs";
const api_url_vehicledetail = environment.apiUrl + "/api/vehicledatas";

@Injectable({
  providedIn: "root"
})
export class VehicleService {
  routeParams: any;
  
  constructor(private http: HttpClient) {}

  private authorizationHeader() {
    let token = environment.production ? window.localStorage.getItem(`token@${environment.appName}`) : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTcyNDIyNTE2Mzg5NzAwMWEyNzdlM2UiLCJmaXJzdG5hbWUiOiJ0aGVlcmFzYWsiLCJsYXN0bmFtZSI6InR1YnJpdCIsImRpc3BsYXluYW1lIjoidGhlZXJhc2FrIHR1YnJpdCIsInByb2ZpbGVJbWFnZVVSTCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vaGZsdmxhdjA0L2ltYWdlL3VwbG9hZC92MTQ4NzgzNDE4Ny9nM2h3eWllYjdkbDd1Z2RnajN0Yi5wbmciLCJyb2xlcyI6WyJ1c2VyIl0sInVzZXJuYW1lIjoiMDg5NDQ0NzIwOCIsInByb3ZpZGVyIjoibG9jYWwiLCJpYXQiOjE1ODQ1NDYzNDIsImV4cCI6MTU5MTc0NjM0Mn0.zjKgz4zjfHLnB_F0WRsctN8mpygZfpmaxk2e0P2fP4o";
    
    const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
    return headers;
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    console.log("resolve with params : " + JSON.stringify(this.routeParams));
    if (this.routeParams.id) {
      if (this.routeParams.id !== "new") {
        return this.getVehicleData(this.routeParams.id);
      }
    } else {
      return this.getVehicleDataList(0, 10, '');
    }
  }

  getVehicleDetailList() {
    return this.http
    .get(api_url_vehicledetail, {
      headers: this.authorizationHeader()
    });
  }


  getVehicleStaffList() {
    return this.http
    .get(api_url_customer, {
      headers: this.authorizationHeader()
    });
  }

  getVehicleDataList(pageNo, pageSize, keyword){
    const params = new HttpParams()
    .set("pageNo", `${pageNo + 1}`)
    .set("size", `${pageSize}`)
    .set("keyword", `${keyword}`);

    return this.http
    .get(api_url, {
      headers: this.authorizationHeader(),
      params: params,
    }).toPromise();
  }

  getVehicleData(id: any) {
    return this.http.get(api_url + id, {
      headers: this.authorizationHeader()
    });
  }

  createVehicleData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(api_url, body, { headers: this.authorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  updateVehicleData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .put(api_url + body._id, body, { headers: this.authorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  deleteVehicleData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(api_url + body._id, { headers: this.authorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }
}