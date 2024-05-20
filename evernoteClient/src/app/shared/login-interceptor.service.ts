import {
  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from "ngx-toastr";

@Injectable()
export class LoginInterceptorService implements HttpInterceptor {
  constructor(private toastr: ToastrService,) {
  }
  
  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.toastr.error("Incorrect username or password", "Login error");
        }
      }
    }));
  }
}