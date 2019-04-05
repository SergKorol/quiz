import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError} from 'rxjs/operators';


@Injectable()

export class AuthResponseInterceptor implements HttpInterceptor {

  currentRequest: HttpRequest<any>;
  auth: AuthService;

  constructor(private injector: Injector, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.injector.get(AuthService);
    const token = (this.auth.isLoggedIn()) ? this.auth.getAuth().token : null;
    if (token) {
      // save current request
      this.currentRequest = request;
      return  next.handle(request).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do nothing
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // JWT token might be expired:
            // try to get a new one using refresh token
            console.log('Token expired. Attempting refresh...');
            this.auth.refreshToken().subscribe(res => {
              if (res) {
                // refresh token successful
                console.log('refresh token successful');
                // re-submit the failed request
                const http = this.injector.get(HttpClient);
                http.request(this.currentRequest).subscribe(resault => {
                  // do something
                }, e => console.error(e));
              } else {
                // refresh token failed
                console.log('refresh token failed');
                // erase current token
                // redirect to login page
                this.router.navigate(['login']);
              }
            }, e => console.log(e));
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(request);
    }
  }

  // handleError(err: Error | HttpErrorResponse) {
  //   if (err instanceof HttpErrorResponse) {
  //     if (err.status === 401) {
  //       // JWT token might be expired:
  //       // try to get a new one using refresh token
  //       console.log('Token expired. Attempting refresh...');
  //       this.auth.refreshToken().subscribe(res => {
  //         if (res) {
  //           // refresh token successful
  //           console.log('refresh token successful');
  //           // re-submit the failed request
  //           const http = this.injector.get(HttpClient);
  //           http.request(this.currentRequest).subscribe(result => {
  //             // do something
  //           }, error => console.error(error));

  //         } else {
  //           // refresh token failed
  //           console.log('refresh token failed');
  //           // erase current token
  //           this.auth.logout();
  //           // redirect to login page
  //           this.router.navigate(['login']);
  //         }
  //       }, error => console.log(error));
  //     }
  //   }
  //   return throwError(err);
  // }
}
