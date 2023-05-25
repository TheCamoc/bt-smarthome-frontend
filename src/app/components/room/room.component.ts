import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { combineLatest, filter } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ height: 0 }),
                        animate('0.4s ease-out',
                            style({ height: "*" }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ height: "*" }),
                        animate('0.4s ease-in',
                            style({ height: 0 }))
                    ]
                )
            ]
        )
    ]
})
export class RoomComponent implements OnInit {
    sensors: any[];
    switches: any[];
    thermostats: any[];
    fans: any[];
    lights: any[];
    rooms: any[];
    intervals: any[];

    constructor(private dataService: DataService, private router: Router, private authService: AuthenticationService) {
        this.sensors = [];
        this.switches = [];
        this.thermostats = [];
        this.fans = [];
        this.lights = [];
        this.rooms = [];
        this.intervals = [];

        router.events.subscribe({
            next: (event) => {
                if (event instanceof NavigationEnd) {
                    if (event.url != '/') {
                        for (let id of this.intervals) {
                            clearInterval(id);
                        }
                    }
                }
            }
        });
    }

    ngOnInit(): void {
        this.authService.loadToken().then(() => {
            this.getData();
            this.intervals.push(setInterval(() => this.getData(), 5000));
        },
            () => {
                this.router.navigate(['/login']);
            });
    }

    getData() {
        let roomRequest = this.dataService.getRooms();
        let sensorRequest = this.dataService.getSensors();
        let switchRequest = this.dataService.getSwitches();
        let thermostatRequest = this.dataService.getThermostats();
        let fanRequest = this.dataService.getFans();
        let lightRequest = this.dataService.getLights();
        
        combineLatest([roomRequest, sensorRequest, switchRequest, lightRequest, thermostatRequest, fanRequest]).forEach((devices) => {
            this.updateData(devices[0], 'room');
            this.updateData(devices[1], 'sensor');
            this.updateData(devices[2], 'switch');
            this.updateData(devices[3], 'light');
            this.updateData(devices[4], 'thermostat');
            this.updateData(devices[5], 'fan');
        });
    }

    getObjectByUrl(url: string) {
        for (let object of [...this.sensors, ...this.switches, ...this.lights, ...this.rooms, ...this.thermostats, ...this.fans]) {
            if (object.url == url) {
                return object;
            }
        }
        return undefined;
    }

    updateData(newdata: any, type: string) {
        for (let object of newdata) {
            let existing = this.getObjectByUrl(object.url);
            if (existing) {
                for (let key in object) {
                    existing[key] = object[key];
                }
            } else {
                switch (type) {
                    case 'sensor':
                        this.sensors.push(object);
                        break;
                    case 'switch':
                        this.switches.push(object);
                        break;
                    case 'light':
                        this.lights.push(object);
                        break;
                    case 'room':
                        this.rooms.push(object);
                        break;
                    case 'thermostat':
                        this.thermostats.push(object);
                        break;
                    case 'fan':
                        this.fans.push(object);
                        break;
                }
            }
        }
    }

    switchSwitch(object: any) {
        object.state = !object.state;
        this.dataService.switchSwitch(object).subscribe();
    }

    updateThermostat(object: any) {
        this.dataService.updateThermostat(object).subscribe();
    }

    updateFan(object: any) {
        this.dataService.updateFan(object).subscribe();
    }

    switchFan(object: any) {
        object.state = !object.state;
        this.updateFan(object);
    }

    switchLight(object: any) {
        object.state = !object.state;
        this.updateLight(object);
    }

    updateLight(object: any) {
        this.dataService.updateLight(object).subscribe();
    }

    expandLight(object: any) {
        object.expanded = !object.expanded;
    }

    expandThermostat(object: any) {
        object.expanded = !object.expanded;
    }
    
    expandFan(object: any) {
        object.expanded = !object.expanded
    }

    formatLabelTemperature(value: number) {
        return value + "°C";
    }

    formatLabelPercent(value: number) {
        return value + "%";
    }
}
