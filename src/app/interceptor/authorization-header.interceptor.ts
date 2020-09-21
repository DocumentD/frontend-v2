import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthorizationService } from '../service/authorization.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthorizationHeaderInterceptor implements HttpInterceptor {
  constructor(private authorizationService: AuthorizationService) {}

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.authorizationService.logout();
      return of(null);
    }
    return throwError(err);
  }

  // HTTP Interceptor to add Auhtoken as Parameter when User is logged in
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let parameter = null;

    if (this.authorizationService.token !== '') {
      parameter = { token: this.authorizationService.token };
    }

    const customReq = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.authorizationService.token,
      },
    });
    return next
      .handle(customReq)
      .pipe(catchError((x) => this.handleAuthError(x)));
  }
}
