import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
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
      }),
      catchError(err => {
        console.log('Unauthorized');
        return throwError(err);
      }
      ));
  }

  // performs the logout
  logout(): boolean {
    this.setAuth(null);
    return true;
  }
  // Persist auth into localStorage or removes it if a NULL argument is given
  setAuth(auth: TokenResponse | null): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (auth) {
        localStorage.setItem(
          this.authKey,
          JSON.stringify(auth));
      } else {
        localStorage.removeItem(this.authKey);
      }
    }
    return true;
  }


  // Retrieves the auth JSON object (or NULL if none)
  getAuth(): TokenResponse | null {
    if (isPlatformBrowser(this.platformId)) {
      const i = localStorage.getItem(this.authKey);
      if (i) { return JSON.parse(i); }

    }
    return null;
  }

  // Returns TRUE if the user is logged in, FALSE otherwise.
  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.authKey) != null;
    }
  }

}
