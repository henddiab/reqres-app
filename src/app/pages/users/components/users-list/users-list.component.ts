import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { map, Subscription } from 'rxjs';
import { usersList } from '../../interfaces/usersList.interface';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  // holds the list of users
  usersList: usersList[] = [];
  // holds the unique identifier (id) for the user
  userID: any;
  // determines whether to show user details
  showUser: boolean = false;
  // determines whether to show the modal
  isModalVisible: boolean = false;
  // holds the selected user data
  selectedUser: any;
  // store all active subscriptions in the component
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UsersService) {}

  /**
   * get list of users
   */
  getUsersList() {
    const listUsersSubscription = this.userService
      .getUsersList()
      .subscribe((res: any) => {
        this.usersList = res.data;
      });
    this.subscriptions.add(listUsersSubscription);
  }

  /**
   * open user view
   * @param user
   */
  openUserView(user: any) {
    this.showUser = true;
    this.userID = user.id;
  }

  /**
   * close user view
   * @param event
   */
  closeViewMode(e: any) {
    this.showUser = e;
  }

  /**
   * get selected user
   * @param event
   */
  getSelectedUser(user: any, e: any) {
    e.stopPropagation();
    this.selectedUser = user;
  }

  /**
   * update list after deleting user
   * @param user
   */
  onUserDeleted(userId: any): void {
    this.usersList = this.usersList.filter((user) => user.id !== userId);
  }

  /**
   * track add/edit user changes
   */
  trackAddEditUser() {
    this.userService.user$.subscribe((data) => {
      if (data) {
        if (data.actionType === 'save') {
          this.usersList = this.usersList.map((user) => {
            if (user.id === data.id) {
              return { ...data.model };
            }
            return user;
          });
        } else if (data.actionType === 'add') {
          this.usersList.unshift(data.model);
        }
      }
    });
  }

  ngOnInit(): void {
    this.getUsersList();
    this.trackAddEditUser();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
