import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authKey = 'auth';
  clientId = 'TestMakerFree';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { }

  // performs the login
  login(username: string, password: string): Observable<boolean> {
    const url = 'api/token/auth';
    const data = {
      username: username,
      password: password,
      client_id: this.clientId,
      // required when signing up with username/password
      grant_type: 'password',
      // space-separated list of scopes for which the token is issued
      scope: 'offline_access profile email'
    };

    return this.http.post<TokenResponse>(url, data).pipe(
      map((res) => {
        const token = res && res.token;
        // if the token is there, login has been successful
        if (token) {
          // store username and jwt token
          this.setAuth(res);
          // successful login
          return true;
        }
      }));



  }
}
