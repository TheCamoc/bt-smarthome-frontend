import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private httpOptions: any;
  private access_token: string | undefined;
  private refresh_token: string | undefined;
  private token_expires: Date | undefined;

  private valid_token = false;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    this.valid_token = this.loadToken();
  }

  public login(username: String, password: String) {
    let request = this.http.post(`${environment.backend_url}/api/token/`, { "username": username, "password": password }, this.httpOptions);

    let result = new Promise((resolve, reject) => {
      request.subscribe({
        error: (e) => reject(e),
        next: (data) => {
          this.updateData(data);
          resolve(true);
        }
      });
    });

    return result;
  }

  private refreshToken() {
    let request = this.http.post(`${environment.backend_url}/api/token/refresh/`, { "refresh": this.refresh_token }, this.httpOptions);

    request.subscribe({
      error: (e) => console.log(e),
      next: (data) => this.updateData(data)
    }
    );

    return request;
  }

  public getAccessToken(): string | undefined {
    if (!this.access_token || !this.token_expires) {
      return;
    }
    if (new Date() > this.token_expires) {
      return;
    }

    return this.access_token;
  }

  private updateData(data: any) {
    this.access_token = data['access'];
    if (data['refresh']) {
      this.refresh_token = data['refresh'];
    }
    this.saveToken();

    if (!this.access_token || !this.refresh_token) {
      return;
    }

    this.token_expires = new Date(this.decodeToken(this.access_token).exp * 1000);
    this.setupRefreshTimer();
  }

  private decodeToken(token: any): any {
    const token_parts = token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    return token_decoded
  }

  private saveToken() {
    localStorage.setItem('jwt', JSON.stringify({"access": this.access_token, "refresh": this.refresh_token}));
  }

  private loadToken(): boolean {
    let full_token = localStorage.getItem('jwt');
    if (full_token == null) {
      return false;
    }

    let parsed_full_token = JSON.parse(full_token);

    this.access_token = parsed_full_token['access'];
    this.refresh_token = parsed_full_token['refresh'];

    if (this.access_token) {
      this.token_expires = new Date(this.decodeToken(this.access_token).exp * 1000);
      this.setupRefreshTimer();
    }

    return this.access_token != undefined && this.refresh_token != undefined;
  }

  private setupRefreshTimer() {
    let this_ = this;
    if (this.refresh_token) {
      if (new Date().getTime() > this.decodeToken(this.refresh_token).exp * 1000) {
        localStorage.removeItem('jwt');
      }

      if (this.token_expires) {
        setTimeout(function () { this_.refreshToken() }, this.token_expires.getTime() - new Date().getTime() - 20000);
      }
    }
  }
}
