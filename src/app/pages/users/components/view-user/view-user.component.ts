import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
})
export class ViewUserComponent implements OnInit {
  // holds the close view mode status
  @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
  // holds the unique identifier for the user
  @Input() userId: any;
  // holds the user data
  userData: any;
  // store all active subscriptions in the component
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UsersService) {}

  /**
   * get data of single user
   */
  getSingleUser() {
    const singleUserSubscription = this.userService
      .getSingleUser(this.userId)
      .subscribe((res: any) => {
        this.userData = res.data;
      });
    this.subscriptions.add(singleUserSubscription);
  }

  /**
   * close view mode
   */
  closeViewMode() {
    this.closeView.emit(false);
  }

  ngOnInit(): void {}

  ngOnChanges() {
    this.getSingleUser();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
