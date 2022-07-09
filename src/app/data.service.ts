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

  getRooms() {
    return this.http.get<Object[]>(`${window.location.origin}/api/rooms/?format=json`);
  }

  switchSwitch(switchObject: any) {
    return this.http.put(switchObject.url, {"state": switchObject.state});
  }
}
