import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  signUpForm;
  loginForm;
  onGoingRequest;

  constructor(
    private router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    let loggedIn = await this.authService.isLoggedIn();

    if(loggedIn){
      this.router.navigate(['main']);
    }

    this.authService.loginFailed.subscribe((loginError) => {
      this._snackBar.open('Unable To Login ! Please check your credentials ', 'close', {
        duration: 2000,
      });
      this.onGoingRequest = false;
    })


  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.onGoingRequest = true;
    this.authService.signIn(this.loginForm.value);
  }

  signUp() {
    if (!this.signUpForm.valid) {
      return;
    }
    this.onGoingRequest = true;

    this.authService.signUp({ ...this.signUpForm.value, roleId: 1 }).subscribe(
      (res) => {
        this.onGoingRequest = false;
        this._snackBar.open('Sign up successful, please check your email', 'close', {
          duration: 2000,
        });
      },
      (err) => {
        this.onGoingRequest = false;
        this._snackBar.open('Something went wrong . ', 'close', {
          duration: 2000,
        });
      }
    );
  }
}
