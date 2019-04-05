import { AuthService } from './auth.service';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

constructor(private injector: Injector) {}

intercept(request: HttpRequest<any>, next: HttpHandler) {
  const auth = this.injector.get(AuthService);
  const token = (auth.isLoggedIn()) ? auth.getAuth().token : null;
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${{token}}`
      }
    });
  }
  return next.handle(request);
}

}
