import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getSwitches() {
    return this.http.get<Object[]>(`${environment.backend_url}/api/switches/?format=json`);
  }

  getRooms() {
    return this.http.get<Object[]>(`${environment.backend_url}/api/rooms/?format=json`);
  }

  switchSwitch(name: any, state: any) {
    return this.http.put(`${environment.backend_url}/api/switches/${name}/`, {"state": state});
  }
}
