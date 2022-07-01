import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  switches: any[];
  rooms: any[];

  constructor(private dataService: DataService) {
    this.switches = [];
    this.rooms = [];
  }

  ngOnInit(): void {
    this.getSwitches();
    this.getRooms();

    let this_ = this;
    //setInterval(function () { this_.getSwitches() }, 5000);
  }

  getSwitches() {
    this.dataService.getSwitches().subscribe((data: Object[]) => this.switches = data);
  }

  getRooms() {
    this.dataService.getRooms().subscribe((data: Object[]) => this.rooms = data);
  }

  switchSwitch(object: any) {
    console.log("hello");
  }
}
