import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { StorageService } from 'src/app/@core/services/storage/storgae.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['setToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should navigate to dashboard and show success message on successful login', () => {
    const mockResponse = { token: 'dummy-token' };
    authService.login.and.returnValue(of(mockResponse));

    component.submitLogin();

    expect(authService.login).toHaveBeenCalled();
    expect(storageService.setToken).toHaveBeenCalledWith(mockResponse.token);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(toastr.success).toHaveBeenCalledWith(
      'you have been logged in successfully',
      EToasterTypes.success
    );
  });

  it('should show error message on login failure', () => {
    authService.login.and.returnValue(throwError({ status: 401 }));

    component.submitLogin();

    expect(authService.login).toHaveBeenCalled();
    expect(toastr.error).toHaveBeenCalledWith(
      'invalid credentials, Please try again',
      EToasterTypes.error
    );
  });
});