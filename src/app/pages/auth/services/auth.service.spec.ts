import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { APIURL } from 'src/app/@core/services/http/api';

fdescribe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isUserLoggedIn', () => {
    it('should return true if token is present in localStorage', () => {
      localStorage.setItem('token', 'dummy-token');
      expect(service.isUserLoggedIn).toBeTruthy();
      localStorage.removeItem('token');
    });

    it('should return false if token is not present in localStorage', () => {
      localStorage.removeItem('token');
      expect(service.isUserLoggedIn).toBeFalsy();
    });
  });

  describe('login', () => {
    it('should call login method with correct credentials', () => {
      const loginCredentials = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      };
      const loginSpy = spyOn(service, 'login').and.callThrough();
      service.login(loginCredentials).subscribe((res) => {});

      const req = httpMock.expectOne('https://reqres.in/api/login');
      expect(req.request.method).toBe('POST');
      req.flush({ token: 'dummy-token' });

      expect(loginSpy).toHaveBeenCalled();
      expect(loginSpy).toHaveBeenCalledWith(loginCredentials);
    });

    it('should return an observable with login response', () => {
      const mockResponse = { token: 'dummy-token' };
      const loginCredentials = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      };

      service.login(loginCredentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(APIURL.login.login);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});
