import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginform: FormGroup = new FormGroup({});
  isSubmitted = false;
  authError = false;
  authMessage = 'Email or Password are wrong';
  endsubscribe$: Subject<any> = new Subject();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private localstorage: LocalstorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.endsubscribe$.next(undefined);
    this.endsubscribe$.complete();
  }

  onLogin() {
    this.isSubmitted = true;
    const user: User = {
      email: this.loginform.controls['email'].value,
      password: this.loginform.controls['password'].value,
    };
    if (this.loginform.invalid) return;
    else {
      this.auth
        .onlogin(user)
        .pipe(takeUntil(this.endsubscribe$))
        .subscribe(
          (user) => {
            this.authError = false;
            this.localstorage.setToken(user.token);
            this.router.navigate(['/tasks']);
          },
          (error: HttpErrorResponse) => {
            this.authError = true;
            if (error.status !== 400) {
              this.authMessage = 'Error in the Server, please try again later!';
            }
          }
        );
    }
  }
}
