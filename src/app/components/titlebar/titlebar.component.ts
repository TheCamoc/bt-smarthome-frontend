import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-titlebar',
  templateUrl: './titlebar.component.html',
  styleUrls: ['./titlebar.component.scss']
})
export class TitlebarComponent implements OnInit {

  admin_site_url = `${window.location.origin}/admin/`;

  constructor() { 
    if (!environment.production) {
      this.admin_site_url = 'http://localhost:8000/admin/'
    }
  }

  ngOnInit(): void {
  }

}
