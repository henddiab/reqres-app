import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { userData } from '../../interfaces/user.interface';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';

@Component({
  selector: 'app-add-edit-modal',
  templateUrl: './add-edit-modal.component.html',
  styleUrls: ['./add-edit-modal.component.scss'],
})
export class AddEditModalComponent implements OnInit {
  // holds the unique identifier for the modal element
  @Input() modalId: string = '';
  // holds the type of action to be performed
  @Input() actionType: string = '';
  // holds the user data
  @Input() user: any;
  // reference to the close modal button
  @ViewChild('closeModal') closeModalButton!: ElementRef;
  // emits an event when new user is added
  @Output() userAdded: EventEmitter<any> = new EventEmitter<any>();

  // store all active subscriptions in the component
  public subscriptions: Subscription = new Subscription();

  // represents the reactive form instance
  form: FormGroup = new FormGroup({});

  // holds the initial values for the user form fields
  model: userData = {
    name: '',
    job: '',
  };

  // defines the configuration for the formly fields used in the user form
  fields = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Name',
        placeholder: 'Name',
        required: true,
      },
    },
    {
      key: 'job',
      type: 'input',
      templateOptions: {
        type: 'text',
        label: 'Job Title',
        placeholder: 'Job Title',
        required: true,
      },
    },
  ];

  constructor(
    private userService: UsersService,
    private toaster: ToastrService
  ) {}

  /**
   * update user
   */
  updateUser() {
    const updateUserSubscription = this.userService
      .updateUser(this.user?.id, this.model)
      .subscribe((res) => {
        if (res) {
          this.userService.emitUser({
            actionType: 'save',
            model: this.model,
            id: this.user?.id,
          });
          this.toaster.success(
            'User have been updated successfully',
            EToasterTypes.success
          );
        } else {
          this.toaster.error(
            'an error occurred while updating user',
            EToasterTypes.error
          );
        }
        this.closeModalButton.nativeElement.click();
      });
    this.subscriptions.add(updateUserSubscription);
  }

  /**
   * add user
   */
  addUser() {
    const addUserSubscription = this.userService
      .addUser(this.model)
      .subscribe((res) => {
        if (res) {
          this.userService.emitUser({
            actionType: 'add',
            model: this.model,
            response: res,
          });
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
        this.closeModalButton.nativeElement.click();
      });
    this.subscriptions.add(addUserSubscription);
  }

  /**
   * add or edit user based on action type
   */
  addEditUser() {
    if (this.actionType.toLocaleLowerCase() === 'save') {
      this.updateUser();
    } else {
      this.addUser();
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {}
}
