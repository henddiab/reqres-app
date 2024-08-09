import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public tokenName = 'token';

  constructor() {}

  /**
   * Get the token for the current active user
   * @returns  User Token
   */
  getToken(localStorageName = this.tokenName): any {
    return localStorage.getItem(localStorageName);
  }
  /**
   * Set the token for the current active user
   * @returns  User Token
   * @param token The token returned from backend
   * @param localStorageName The name of the local storage
   */
  setToken(token: string, localStorageName = this.tokenName) {
    localStorage.setItem(localStorageName, token);
  }
}
