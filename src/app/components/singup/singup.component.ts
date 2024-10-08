import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { Toast } from 'bootstrap';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css'],
})
export class SingupComponent implements OnInit, OnDestroy {
  signupform: FormGroup = new FormGroup({});
  isSubmitted = false;
  authError = false;
  authMessage = 'Another user is present with the same email id';
  endsubscribe$: Subject<any>= new Subject();
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.endsubscribe$.next(undefined);
    this.endsubscribe$.complete();
  }

  onSignUp() {
    this.isSubmitted = true;

    const user: User = {
      email: this.signupform.controls['email'].value,
      password: this.signupform.controls['password'].value,
    };

    if (this.signupform.invalid) return;
    else {
      console.log(this.signupform.value);
      this.auth.onSignUp(user).pipe(takeUntil(this.endsubscribe$)).subscribe(
        () => {
          this.authError = false;
          const toasts = document.querySelectorAll('.toast');
          const toast = new Toast(toasts[0]);
          toast.show();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        (error: HttpErrorResponse) => {
          this.authError = true;
          if (error.status !== 400) {
            this.authMessage = 'Unable to signin, please try again later!';
            console.log(
              'mail already registered. Please try with another mail id'
            );
          }
        }
      );
    }
  }
}
