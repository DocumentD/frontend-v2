import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../entity/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  public token = '';
  private user: User = null;
  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  private loggedInUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    this.user
  );

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  public async login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<User>(
          environment.apiEndpoint + '/login',
          { username, password },
          { observe: 'response' }
        )
        .subscribe(
          (resp) => {
            this.handleUserDataResponse(resp.body);
            this.token = resp.headers.get('Token');
            this.cookieService.set('Token', this.token);
            resolve();
          },
          (error) => {
            this.logout();
            reject();
          }
        );
    });
  }

  public async logout(): Promise<void> {
    this.cookieService.delete('token');
    this.isAuthenticated.next(false);
    this.loggedInUser.next(null);
    this.user = null;
    this.router.navigate(['login']);
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated.getValue();
  }

  public getLoggedInUser(): Observable<User> {
    return this.loggedInUser.asObservable();
  }

  private handleUserDataResponse(data: User): void {
    this.user = data;
    this.isAuthenticated.next(true);
    this.loggedInUser.next(this.user);
  }
}
