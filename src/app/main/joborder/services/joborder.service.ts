import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "environments/environment";
import { AuthenService } from 'app/authentication/authen.service';
import { TH_CONTACTSTATUS,  TH_ORDERSTATUS } from 'app/types/tvds-status';
import * as XLSX from 'xlsx';
import * as moment from "moment";
import * as jsPDF from "jspdf";


const api_url = environment.apiUrl + "/api/joborders/";
const api_url_vehicle = environment.apiUrl + "/api/vehicles/";
const api_url_markers = environment.apiUrl + "/api/jobordersupdatemap/";
const api_url_line = environment.apiUrl + "/api/lineconnects/members/push";


@Injectable({
  providedIn: "root",
})
export class JoborderService {
  routeParams: any;

  constructor(
    private http: HttpClient,
    private auth: AuthenService,
  ) {

  }

  // private authorizationHeader() {
  //   // let token = environment.production
  //   //   ? window.localStorage.getItem(`token@${environment.appName}`)
  //   //   : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTcyNDIyNTE2Mzg5NzAwMWEyNzdlM2UiLCJmaXJzdG5hbWUiOiJ0aGVlcmFzYWsiLCJsYXN0bmFtZSI6InR1YnJpdCIsImRpc3BsYXluYW1lIjoidGhlZXJhc2FrIHR1YnJpdCIsInByb2ZpbGVJbWFnZVVSTCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vaGZsdmxhdjA0L2ltYWdlL3VwbG9hZC92MTQ4NzgzNDE4Ny9nM2h3eWllYjdkbDd1Z2RnajN0Yi5wbmciLCJyb2xlcyI6WyJ1c2VyIl0sInVzZXJuYW1lIjoiMDg5NDQ0NzIwOCIsInByb3ZpZGVyIjoibG9jYWwiLCJpYXQiOjE1ODQ1NDYzNDIsImV4cCI6MTU5MTc0NjM0Mn0.zjKgz4zjfHLnB_F0WRsctN8mpygZfpmaxk2e0P2fP4o";
  //   let token = window.localStorage.getItem(`token@${environment.appName}`);

  //   const headers = new HttpHeaders().set("Authorization", "Bearer " + token);
  //   return headers;
  // }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;
    // console.log("resolve with params : " + JSON.stringify(this.routeParams));
    if (this.routeParams.id) {
      if (this.routeParams.id !== "new") {
        return this.getJoborderData(this.routeParams.id);
      }
    } else {
      return this.getJoborderDataList(0, 10, "", "created", "desc");
    }
  }

  getJoborderDataList(pageNo, pageSize, keyword, orderBy, orderDir) {
    const params = new HttpParams()
      .set("pageNo", `${pageNo + 1}`)
      .set("size", `${pageSize}`)
      .set("keyword", `${keyword}`)
      .set("orderBy", `${orderBy}`)
      .set("orderDir", `${orderDir}`);

    return this.http
      .get(api_url, {
        headers: this.auth.getAuthorizationHeader(),
        params: params,
      })
      .toPromise();
  }

  getJoborderData(id: any) {
    return this.http.get(api_url + id, {
      headers: this.auth.getAuthorizationHeader(),
    });
  }

  getVehicleData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .get(api_url_vehicle, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  getMarkerDataList(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(api_url_markers, body, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  sendConFirmData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(api_url_line, body, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  createJoborderData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .post(api_url, body, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  updateJoborderData(id, body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .put(api_url + id, body, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  deleteJoborderData(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(api_url + body._id, { headers: this.auth.getAuthorizationHeader() })
        .subscribe((res: any) => {
          resolve(res.data);
        }, reject);
    });
  }

  checkValidJobOrder(body) {
    return this.http
      .post(environment.apiUrl + "/api/checkvalidjob", body, {
        headers: this.auth.getAuthorizationHeader(),
      })
      .toPromise();
  }

  /**
   * download joborder xlsx
   * @param joborderData 
   * @param filename 
   */
  downloadAsXLSX(joborderData: any, filename: string): void {
    const data: any[] = [];

    // create each row
    for (const contact of joborderData.contactLists) {
        data.push({
          datadate: `${moment(joborderData.docdate).format('DD/MM/YYYY')}`,
          docno: joborderData.docno,
          orderstatus: TH_ORDERSTATUS[joborderData.orderStatus],
          carno: joborderData.carNo.lisenceID,
          driver: joborderData.carNo.driverInfo.displayName,
          displayName: contact.displayName,
          district: contact.addressDistrict,
          subdistrict: contact.addressSubDistrict,
          province: contact.addressProvince,
          status: TH_CONTACTSTATUS[contact.contactStatus],
          sales: contact.sales,
        });
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, joborderData.docno);
    XLSX.writeFile(wb, filename);
  }

  /**
   * download joborder pdf
   * @param data 
   * @param filename 
   */
  downloadAsPDF(data, filename): void {
    const doc = new jsPDF();
    // Line position
    const lineSpace = 8;
    let line = 15;

    // Format Number
    const nFormat = Intl.NumberFormat('en-GB', {minimumFractionDigits: 2});

    // total sales
    let salesAmount = 0;

    // let a = doc.getFontList();
    // console.log(a);
    doc.setFont('THSarabun');
    doc.setFontType('normal');
    // doc.setFontType("bold");
    doc.setFontSize(16);

    // console.log(data);  
    
    // Header
    doc.text(
      15,
      line,
      `วันที่พิมพ์ : ${moment(Date.now()).format('DD/MM/YYYY HH:MM:SS')}`
    );
    doc.text(140, line, `เลขที่ : ${data.docno}`);

    line += lineSpace;
    doc.text(15, line, `รถธรรมธุรกิจ ทะเบียนรถ : ${data.carNo.lisenceID}`);
    doc.text(140, line, `วันที่ : ${moment(data.docdate).format('DD/MM/YYYY')}`);

    line += lineSpace;
    doc.text(
      15,
      line,
      `ผู้ให้บริการ : ${data.carNo.driverInfo.displayName} [${data.carNo.driverInfo.mobileNo1}]`
    );
    doc.text(140, line, `สถานะใบงาน: ${TH_ORDERSTATUS[data.orderStatus]}`);

    // Table Header
    line += 10;
    doc.rect(15, line, 180, 10);
    line += 7;
    doc.text(20, line, 'ลำดับที่');
    doc.text(55, line, 'รายละเอียด');
    doc.text(155, line, 'ยอดขาย');

    // Description contact
    line += lineSpace + 2;
    for (let index = 0; index < data.contactLists.length; index++) {
      const contact: any = data.contactLists[index];

      // Do not print customer that reject
      if (contact.contactStatus === 'reject') {
        continue;
      }

      // let mno = `${contact.mobileNo1}`;
      // Add new Page
      if (line >= 257) {
        doc.addPage();
        line = 15;
      }

      doc.text(23, line, `${index + 1}.`);
      doc.text(40, line, `คุณ ${contact.firstName} ${contact.lastName} [ ${contact.mobileNo1}]`);

      // print only sales is not equal zero
      const sales: number = contact.sales ? contact.sales : 0;
      if (sales !== 0) {
        salesAmount += sales;
        doc.text(155, line, nFormat.format(sales));
      }

      line += lineSpace;
      doc.text(40, line, `${contact.addressLine1} ${contact.addressStreet}`);
      line += lineSpace;
      doc.text(
        40,
        line,
        `${contact.addressSubDistrict} ${contact.addressDistrict} ${contact.addressProvince} ${contact.addressPostCode}`
      );

      line += lineSpace;
      doc.text(40, line, `สถานะ : ${TH_CONTACTSTATUS[contact.contactStatus]}`);

      line += lineSpace + 2;
    }

    // Sales Amount
    if (salesAmount !== 0) {
      line += lineSpace;
      doc.line(140, line - 7, 190, line - 7);

      doc.text(100, line, 'ยอดขายรวม');
      doc.text(155, line, nFormat.format(salesAmount));

      doc.line(140, line + 5, 190, line + 5);
      doc.line(140, line + 6, 190, line + 6);
    }
    
    doc.save(filename);
  }
}
