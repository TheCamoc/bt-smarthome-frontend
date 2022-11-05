import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { retry } from 'rxjs/operators';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.authenticationService.hasValidToken()) {
      this.router.navigate(['/login']);
    }
    request = request.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + this.authenticationService.getAccessToken()
      }
    })
    return next.handle(request).pipe(retry(2));
  }
}
