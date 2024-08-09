import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  api = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private token: LocalstorageService,
    private router: Router
  ) {}

  onSignUp(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/users/register`, user);
  }

  onlogin(user: User): Observable<User> {
    return this.http.post<User>(`${this.api}/users/login`, user);
  }

  logout() {
    this.token.removeToken();
    this.router.navigate(['/login']);
  }
}
