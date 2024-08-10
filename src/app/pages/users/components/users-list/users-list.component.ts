import { Component, HostListener, OnInit } from '@angular/core';
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
  // holds the selected row index
  selectedRow: number = 0;
  // holds the page number
  page: number = 1;
  // loading state
  loading: boolean = false;
  // store all active subscriptions in the component
  public subscriptions: Subscription = new Subscription();

  constructor(private userService: UsersService) {}

  /**
   * listen to the scroll event
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading
    ) {
      this.loadMoreData();
    }
  }

  /**
   * load more data in the list
   */
  loadMoreData(): void {
    this.loading = true;
    this.userService.getUsersList(this.page + 1).subscribe(
      (users: any) => {
        this.usersList = [...this.usersList, ...users.data];
        this.page += 1;
        this.loading = false;
        if (this.usersList.length >= users.total) {
          return; // Stop loading more data if all items are loaded
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  /**
   * get list of users
   */
  getUsersList() {
    const listUsersSubscription = this.userService
      .getUsersList(this.page)
      .subscribe((res: any) => {
        this.usersList = res.data;
      });
    this.subscriptions.add(listUsersSubscription);
  }

  /**
   * open user view
   * @param user
   */
  openUserView(user: any, index: number) {
    this.selectedRow = index;
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
              // >> this is the original code but there is an issue with the api data & api return
              return { ...data.model };
              // >> this is static data to handle api issues
              // return {
              //   id: user.id,
              //   first_name: data.model.name,
              //   last_name: data.model.job,
              //   email: user.email,
              //   avatar: user.avatar,
              // };
            }
            return user;
          });
        } else if (data.actionType === 'add') {
          // >> this is the original code but there is an issue with the api data & api return
          this.usersList.unshift(data.model);
          // >> this is static data to handle api issues
          // this.usersList.unshift({
          //   id: data.response.id,
          //   first_name: data.model.name,
          //   last_name: data.model.job,
          //   email: 'newUser@email.com',
          //   avatar: 'https://via.placeholder.com/100x100.png',
          // });
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
