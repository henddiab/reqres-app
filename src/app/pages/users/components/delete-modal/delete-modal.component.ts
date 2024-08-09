import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  // holds the unique identifier for the modal element
  @Input() modalId: string = '';
  // holds the user data
  @Input() user: any;
  // reference to the close modal button
  @ViewChild('closeModal') closeModalButton!: ElementRef;
  // emits an event when user is deleted
  @Output() userDeleted: EventEmitter<any> = new EventEmitter<any>();

  // store all active subscriptions in the component
  public subscriptions: Subscription = new Subscription();

  constructor(
    private userService: UsersService,
    private toaster: ToastrService
  ) {}

  /**
   * delete selected user from list
   */
  deleteUser() {
    const deleteUserSubscription = this.userService
      .deleteUser(this.user.id)
      .subscribe((res) => {
        if (res) {
          this.userDeleted.emit(this.user.id);
          this.toaster.success(
            'User have been added successfully',
            EToasterTypes.success
          );
        } else {
          this.toaster.error(
            'an error occurred while adding user',
            EToasterTypes.error
          );
        }
      });
    this.closeModalButton.nativeElement.click();
    this.subscriptions.add(deleteUserSubscription);
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
