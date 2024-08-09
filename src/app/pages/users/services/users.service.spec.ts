import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { APIURL } from 'src/app/@core/services/http/api';
import { userData } from '../interfaces/user.interface';
import { usersList } from '../interfaces/usersList.interface';
import { BehaviorSubject } from 'rxjs';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService],
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('check if getUsersList is called', () => {
    const mockUsersList = [
      { id: 1, avatar: '', email: '', first_name: 'John', last_name: 'Doe' },
      { id: 2, avatar: '', email: '', first_name: 'John', last_name: 'Doe' },
    ];

    const getUsersListSpy = spyOn(service, 'getUsersList').and.callThrough();
    service.getUsersList(1).subscribe((users) => {
      expect(users).toEqual(mockUsersList);
    });

    const req = httpMock.expectOne(`${APIURL.users.listUsers}?page=1`);
    req.flush(mockUsersList);

    expect(getUsersListSpy).toHaveBeenCalled();
  });

  it('should fetch users list', () => {
    const mockUsersList = [
      { id: 1, avatar: '', email: '', first_name: 'John', last_name: 'Doe' },
      { id: 2, avatar: '', email: '', first_name: 'John', last_name: 'Doe' },
    ];

    const getUsersListSpy = spyOn(service, 'getUsersList').and.callThrough();
    service.getUsersList(1).subscribe((users) => {
      expect(users).toEqual(mockUsersList);
    });

    const req = httpMock.expectOne(`${APIURL.users.listUsers}?page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsersList);

    expect(getUsersListSpy).toHaveBeenCalled();
  });

  it('should fetch single user data', () => {
    const mockUser: usersList = {
      id: '1',
      avatar: '',
      email: '',
      first_name: 'John',
      last_name: 'Doe',
    };
    const userId = '1';

    service.getSingleUser(userId).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${APIURL.users.singleUser}${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should add a user', () => {
    const mockResponse = { success: true };
    const user: userData = { name: 'John Doe', job: 'Developer' };

    service.addUser(user).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(APIURL.users.addUser);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update user data', () => {
    const mockResponse = { success: true };
    const userId = '1';
    const user: userData = { name: 'John Doe', job: 'Developer' };

    service.updateUser(userId, user).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${APIURL.users.updateUser}${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a user', () => {
    const mockResponse = { success: true };
    const userId = '1';

    service.deleteUser(userId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${APIURL.users.deleteUser}${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should emit user data', () => {
    const mockUser = { id: '1', name: 'John Doe' };
    service.userSubject = new BehaviorSubject<any>({});
    spyOn(service.userSubject, 'next');

    service.emitUser(mockUser);

    expect(service.userSubject.next).toHaveBeenCalledWith(mockUser);
  });
});
