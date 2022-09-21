import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    
  }

  getSwitches() {
    return this.http.get<Object[]>(`${window.location.origin}/api/switches/?format=json`);
  }

  getLights() {
    return this.http.get<Object[]>(`${window.location.origin}/api/lights/?format=json`);
  }

  getRooms() {
    return this.http.get<Object[]>(`${window.location.origin}/api/rooms/?format=json`);
  }

  switchSwitch(switchObject: any) {
    return this.http.patch(switchObject.url, {"state": switchObject.state});
  }

  updateLight(lightObject: any) {
    return this.http.patch(lightObject.url, {"state": lightObject.state});
  }
}
