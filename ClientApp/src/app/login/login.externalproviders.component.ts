import { AuthService } from './../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var window: any;

@Component({
  selector: 'app-login-externalproviders',
  templateUrl: './login.externalproviders.component.html',
  styleUrls: ['./login.externalproviders.component.css']
})
export class LoginExternalprovidersComponent implements OnInit {

  externalProviderWindow: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // close previously opened windows (if any)
    this.closePopUpWindow();

    // instantiate the externalProviderLogin function
    // (if it doesn't exist already)

    const self = this;
    if (window.externalProviderLogin) {
      window.externalProviderLogin = function (auth: TokenResponse) {
        self.zone.run(() => {
          console.log('External Login successful!');
          self.authService.setAuth(auth);
          self.router.navigate(['']);
        });
      };
    }
  }

  closePopUpWindow() {
    if (this.externalProviderWindow) {
      this.externalProviderWindow.close();
    }
    this.externalProviderWindow = null;
  }

  callExternalLogin(providerName: string) {
    if (!isPlatformBrowser) {
      return;
    }

    const url = this.baseUrl + 'api/Token/ExternalLogin/' + providerName;
    // minimalistic mobile devices support
    const w = (screen.width >= 1050) ? 1050 : screen.width;
    const h = (screen.height >= 550) ? 550 : screen.height;
    const params = 'toolbar=yes,scrollbars=yes,resizeble=yes,width=' + w + ', heigh=' + h;
    // close previously opened windows (if any)
    this.closePopUpWindow();
    this.externalProviderWindow = window.open(url, 'ExternalProvider', params, false);
  }

}
