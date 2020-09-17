import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../service/authorization.service';

@Injectable()
export class AuthorizationHeaderInterceptor implements HttpInterceptor {
  constructor(private authorizationService: AuthorizationService) {}

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
    return next.handle(customReq);
  }
}
