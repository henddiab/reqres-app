import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Subscription } from 'rxjs';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';
import { StorageService } from 'src/app/@core/services/storage/storgae.service';
import { loginCredentials } from 'src/app/pages/auth/interfaces/login.interface';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // store all active subscriptions in the component
  private subscriptions: Subscription = new Subscription();

  // represents the reactive form instance
  form: FormGroup = new FormGroup({});

  // holds the initial values for the login form fields
  model: loginCredentials = {
    email: '',
    password: '',
  };

  // defines the configuration for the formly fields used in the login form
  fields = [
    {
      key: 'email',
      type: 'input',
      templateOptions: {
        type: 'email',
        label: 'Username',
        placeholder: 'Username',
        required: true,
      },
    },
    {
      key: 'password',
      type: 'input',
      templateOptions: {
        type: 'password',
        label: 'Password',
        placeholder: 'Password',
        required: true,
      },
    },
  ];

  constructor(
    private apiService: AuthService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  /**
   * submit login form
   */
  submitLogin() {
    if (this.form.valid) {
      const loginSubscription = this.apiService
        .login(this.form.value)
        .pipe(
          map((response: any) => {
            if (response.token) {
              this.storageService.setToken(response.token);
            }
          })
        )
        .subscribe(
          () => {
            this.router.navigate(['/dashboard']);
            this.toastr.success(
              'you have been logged in successfully',
              EToasterTypes.success
            );
          },
          (error) => {
            this.toastr.error(
              'invalid credentials, Please try again',
              EToasterTypes.error
            );
          }
        );
      this.subscriptions.add(loginSubscription);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {}
}
