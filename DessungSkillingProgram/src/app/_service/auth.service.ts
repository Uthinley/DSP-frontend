import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequestPayload } from 'src/app/login/login-request.payload';
import { LoginResponse } from 'src/app/login/login-response.payload';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  roleList = [];
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    userCode: this.getUserCode(),
  };
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalService,
    private localStorage: LocalStorageService) {
  }
  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/authenticate`,
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);
        this.localStorage.store('roles', data.roles);
        this.loggedIn.emit(true);
        this.username.emit(data.username);
        return true;
      }));
  }
  getJwtToken() {
    return this.localStorage.retrieve('authenticationToken');
  }
  refreshToken() {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/refresh-token`,
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }
  logout() {
    this.globalService.postRequest(`${environment.apiUrl}/logout`, this.refreshTokenPayload);
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('userCode');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('roles');
  }
  getUserRole() {
    return this.localStorage.retrieve('roles');
  }
  getUserCode() {
    return this.localStorage.retrieve('userCode');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }
  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
  isTokenExpired(){
    return Math.floor((new Date).getTime() / 1000) >= this.localStorage.retrieve('expiresAt')
    // return this.localStorage.retrieve('expiresAt');
  }
}
