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

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(private spinner: NgxSpinnerService) { }
  ;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.spinner.hide();
        if (error.status === 401) {
          // refresh token
        } else {
          return throwError(error);
        }
      })
    );
  }
}
