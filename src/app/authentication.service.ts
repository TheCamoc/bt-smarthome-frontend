import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public httpOptions: any;
  public access_token: string | undefined;
  public refresh_token: string | undefined;
  public access_token_expires: Date | undefined;
  public refresh_token_expires: Date | undefined;
  public valid_token = false;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    //this.loadToken();
  }

  public hasValidToken() {
    if (this.access_token && this.refresh_token && this.access_token_expires && this.refresh_token_expires) {
      if (new Date().getTime() < this.refresh_token_expires.getTime()) {
        return true;
      }
    }
    this.clearTokens();
    return false;
  }

  public login(username: String, password: String) {
    let request = this.http.post(`${window.location.origin}/api/token/`, { "username": username, "password": password }, this.httpOptions);

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
    if (this.refresh_token_expires && new Date().getTime() > this.refresh_token_expires.getTime()) {
      this.clearTokens();
      return;
    }

    let request = this.http.post(`${window.location.origin}/api/token/refresh/`, { "refresh": this.refresh_token }, this.httpOptions);

    request.subscribe({
      error: (e) => console.log(e),
      next: (data) => this.updateData(data)
    });

    return request;
  }

  public getAccessToken(): string | undefined {
    return this.access_token;
  }

  private updateData(data: any) {
    this.access_token = data['access'];
    if (data['refresh']) {
      this.refresh_token = data['refresh'];
    }
    this.saveToken();

    if (this.access_token && this.refresh_token) {
      this.access_token_expires = new Date(this.decodeToken(this.access_token).exp * 1000);
      this.refresh_token_expires = new Date(this.decodeToken(this.refresh_token).exp * 1000);
      this.setupRefreshTimer();
    }
  }

  private saveToken() {
    localStorage.setItem('jwt', JSON.stringify({"access": this.access_token, "refresh": this.refresh_token}));
  }

  public loadToken() {
    let full_token = localStorage.getItem('jwt');
    if (full_token == null) {
      return new Promise((resolve, reject) => {
        reject();
      })
    }

    let parsed_full_token = JSON.parse(full_token);

    this.access_token = parsed_full_token['access'];
    this.refresh_token = parsed_full_token['refresh'];

    if (this.access_token && this.refresh_token) {
      this.access_token_expires = new Date(this.decodeToken(this.access_token).exp * 1000);
      this.refresh_token_expires = new Date(this.decodeToken(this.refresh_token).exp * 1000);

      return new Promise<void>((resolve, reject) => {
        if (this.access_token_expires && new Date().getTime() > this.access_token_expires.getTime()) {
          let request = this.http.post(`${window.location.origin}/api/token/refresh/`, { "refresh": this.refresh_token }, this.httpOptions);

          request.subscribe({
            error: (e) => reject(e),
            next: (data) => {this.updateData(data); this.setupRefreshTimer(); resolve()}
          });
        } else {
          this.setupRefreshTimer();
          resolve();
        }
      });
    }

    return new Promise((resolve, reject) => {
      reject();
    })
  }

  private setupRefreshTimer() {
    let this_ = this;
    if (this.refresh_token && this.refresh_token_expires) {
      if (new Date().getTime() > this.refresh_token_expires.getTime()) {
        this.clearTokens();
        return;
      }

      if (this.access_token_expires) {
        setTimeout(function () { this_.refreshToken() }, this.access_token_expires.getTime() - new Date().getTime() - 20000);
      }
    }
  }

  private decodeToken(token: any): any {
    const token_parts = token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    return token_decoded
  }

  private clearTokens() {
    localStorage.removeItem('jwt');
    this.access_token = undefined;
    this.refresh_token = undefined;
    this.access_token_expires = undefined;
    this.refresh_token_expires = undefined;
  }
}
