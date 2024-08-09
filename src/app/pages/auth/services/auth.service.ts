import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIURL } from 'src/app/@core/services/http/api';
import { loginCredentials } from '../interfaces/login.interface';

const apiUrl = APIURL;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  /**
   * check if user is logged in or not
   */
  get isUserLoggedIn() {
    const loggedIn = localStorage.getItem('token');
    return loggedIn;
  }

  /**
   * @returns  observable in order to handle login response
   * @param login credentials (mail & password)
   */
  login(data: loginCredentials) {
    return this.http.post(apiUrl.login.login, data);
  }
}
