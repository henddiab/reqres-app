import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIURL } from 'src/app/@core/services/http/api';
import { userData } from '../interfaces/user.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * @returns returns an Observable that emits Users List
   */
  getUsersList() {
    return this.http.get(APIURL.users.listUsers);
  }

  /**
   * get data of single user
   * @returns returns an Observable that emits single user data
   * @param user ID
   */
  getSingleUser(id: string) {
    return this.http.get(`${APIURL.users.singleUser}${id}`);
  }

  /**
   * Set the user data
   * * @returns returns an Observable that emits response after add user
   * @param user data to be saved
   */
  addUser(body: userData) {
    return this.http.post(APIURL.users.addUser, body);
  }

  /**
   * update user data
   * @param user ID
   * * @returns returns an Observable that emits response after update user
   * @param user data to be updated
   */
  updateUser(id: string, body: userData) {
    return this.http.put(`${APIURL.users.updateUser}${id}`, body);
  }

  /**
   * delete user from list
   * * @returns returns an Observable that emits response after delete user
   * @param user ID
   */
  deleteUser(id: string) {
    return this.http.delete(`${APIURL.users.deleteUser}${id}`);
  }

  /**
   * Emit user data
   * @param user data to be emitted
   */
  emitUser(user: any) {
    this.userSubject.next(user);
  }
}
