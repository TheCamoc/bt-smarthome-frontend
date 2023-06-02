import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private api_url = window.location.origin;

    constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
        if (!environment.production) {
            this.api_url = "http://localhost:8000";
        }
    }

    getSensors() {
        return this.http.get<Object[]>(`${this.api_url}/api/sensors/?format=json`);
    }

    getSwitches() {
        return this.http.get<Object[]>(`${this.api_url}/api/switches/?format=json`);
    }

    getLights() {
        return this.http.get<Object[]>(`${this.api_url}/api/lights/?format=json`);
    }

    getThermostats() {
        return this.http.get<Object[]>(`${this.api_url}/api/thermostats/?format=json`);
    }

    getFans() {
        return this.http.get<Object[]>(`${this.api_url}/api/fans/?format=json`);
    }

    getTables() {
        return this.http.get<Object[]>(`${this.api_url}/api/tables/?format=json`);
    }

    getRooms() {
        return this.http.get<Object[]>(`${this.api_url}/api/rooms/?format=json`);
    }

    switchSwitch(switchObject: any) {
        return this.http.patch(switchObject.url, { "state": switchObject.state });
    }

    updateThermostat(thermostatObject: any) {
        return this.http.patch(thermostatObject.url, { 
            "target_temperature": thermostatObject.target_temperature 
        });
    }

    updateFan(fanObject: any) {
        console.log(fanObject);
        return this.http.patch(fanObject.url, { 
            "state": fanObject.state,
            "speed": fanObject.speed 
        });
    }

    updateLight(lightObject: any) {
        return this.http.patch(lightObject.url, {
            "state": lightObject.state,
            "r": lightObject.r,
            "g": lightObject.g,
            "b": lightObject.b,
            "w": lightObject.w
        });
    }

    updateTable(tableObject: any) {
        return this.http.patch(tableObject.url, {
            state: tableObject.state
        })
    }
}
