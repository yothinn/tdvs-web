import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthenService } from './authentication/authen.service';
import { Router } from '@angular/router';
import { MatSnackBar } from "@angular/material";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private auth: AuthenService,
    private snackbar: MatSnackBar,
  ) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        // console.log(error);
        let msg = error.error.message;
        this.spinner.hide();
        if (error.status === 401 || error.status === 403) {
          // refresh token
          msg = 'คุณยังไม่ได้ล็อคอินเข้าระบบ';
          this.auth.logout();
          this.router.navigate(['auth/login']);
        } else if (error.status === 400) {
          // console.log('network error');
          // return throwError(error);
        } else {
          // return throwError(error);
        }

        this.snackbar.open(msg, "OK", {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 8000,
        });
        return throwError(error);
      })
    );
  }
}
