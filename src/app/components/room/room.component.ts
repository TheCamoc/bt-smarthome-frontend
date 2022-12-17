import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { filter } from 'rxjs';
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
            style({ height: 0}),
            animate('0.4s ease-out', 
                    style({ height: "*"}))
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
  lights: any[];
  rooms: any[];
  intervals: any[];

  constructor(private dataService: DataService, private router: Router, private authService: AuthenticationService) {
    this.sensors = [];
    this.switches = [];
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
    this.dataService.getSensors().subscribe((data: Object[]) => this.updateData(data, 'sensor'));
    this.dataService.getSwitches().subscribe((data: Object[]) => this.updateData(data, 'switches'));
    this.dataService.getLights().subscribe((data: Object[]) => this.updateData(data, 'lights'));
    this.dataService.getRooms().subscribe((data: Object[]) => this.updateData(data, 'rooms'));
  }

  getObjectByUrl(url: string) {
    for (let object of [...this.sensors, ...this.switches, ...this.lights, ...this.rooms]) {
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
        switch(type) {
          case 'sensor':
            this.sensors.push(object);
            break;
          case 'switches':
            this.switches.push(object);
            break;
          case 'lights':
            this.lights.push(object);
            break;
          case 'rooms':
            this.rooms.push(object);
            break;
        }
      }
    }
  }

  switchSwitch(object: any) {
    object.state = !object.state;
    this.dataService.switchSwitch(object).subscribe();
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
}
