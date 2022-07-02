import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usernameFormControl = new FormControl('', [Validators.required]);
  passwordFormControl = new FormControl('', [Validators.required]);
  failedLogin = false;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  login(): void {
    if (!this.usernameFormControl.valid || !this.passwordFormControl.valid) {
      this.usernameFormControl.markAsTouched()
      this.passwordFormControl.markAsTouched()
      return;
    }

    if (this.usernameFormControl.value != null && this.passwordFormControl.value != null) {
      this.authenticationService.login(this.usernameFormControl.value, this.passwordFormControl.value).then(
        (reason) => this.router.navigate(['/']),
        (reason) => this.failedLogin = true
      )
    }
  }

}
