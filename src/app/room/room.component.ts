import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from '../data.service';
import { filter } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  switches: any[];
  rooms: any[];
  intervals: any[];

  constructor(private dataService: DataService, private router: Router, private authService: AuthenticationService) {
    this.switches = [];
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
      this.getSwitches();
      this.getRooms();
      this.intervals.push(setInterval(() => this.getRooms(), 5000));
      this.intervals.push(setInterval(() => this.getSwitches(), 5000));
    },
    () => {
      this.router.navigate(['/login']);
    });
  }

  getSwitches() {
    this.dataService.getSwitches().subscribe((data: Object[]) => this.switches = data);
  }

  getRooms() {
    this.dataService.getRooms().subscribe((data: Object[]) => this.rooms = data);
  }

  switchSwitch(object: any) {
    object.state = !object.state;
    this.dataService.switchSwitch(object).subscribe();
  }
}
