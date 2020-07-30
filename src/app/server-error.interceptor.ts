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

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private auth: AuthenService
  ) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.spinner.hide();
        if (error.status === 401 || error.status === 403) {
          // refresh token
          this.auth.logout();
          this.router.navigate(['auth/login']);
        } else if (error.status === 400) {
          console.log('network error');
        } else {
          return throwError(error);
        }
      })
    );
  }
}
