import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService } from '../../service/authorization.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginValid = true;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authorizationService: AuthorizationService,
    private cookieService: CookieService
  ) {}

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || 'search';

    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.checkAutoLogin();
  }

  async onSubmit() {
    this.loginValid = true;
    if (this.form.valid) {
      const username = this.form.get('username').value;
      const password = this.form.get('password').value;
      this.authorizationService
        .login(username, password)
        .then(() => this.router.navigate([this.returnUrl]))
        .catch(() => (this.loginValid = false));
    }
  }

  private async checkAutoLogin(): Promise<void> {
    if (await this.authorizationService.isLoggedIn()) {
      await this.router.navigate([this.returnUrl]);
    } else {
      if (this.cookieService.check('Token')) {
        this.authorizationService
          .loginWithToken(this.cookieService.get('Token'))
          .then(() => this.router.navigate([this.returnUrl]));
      }
    }
  }
}
