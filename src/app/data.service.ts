import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getSwitches() {
    return this.http.get<Object[]>('http://127.0.0.1:8000/api/switches/?format=json');
  }

  getRooms() {
    return this.http.get<Object[]>('http://127.0.0.1:8000/api/rooms/?format=json');
  }
}
