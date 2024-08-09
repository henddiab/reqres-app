import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { UsersListComponent } from './users-list.component';
import { UsersService } from '../../services/users.service';
import { usersList } from '../../interfaces/usersList.interface';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockUserService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', [
      'getUsersList',
    ]);

    let userSubject = new Subject<any>(); // Initialize the Subject

    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      providers: [{ provide: UsersService, useValue: userServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    mockUserService = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;

    userServiceSpy.user$ = userSubject.asObservable();
    mockUserService.getUsersList.and.returnValue(of([]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsersList and trackAddEditUser on ngOnInit', () => {
    spyOn(component, 'getUsersList');
    spyOn(component, 'trackAddEditUser');

    component.ngOnInit();

    expect(component.getUsersList).toHaveBeenCalled();
    expect(component.trackAddEditUser).toHaveBeenCalled();
  });

  describe('getUsersList', () => {
    it('should fetch and set the users list', () => {
      const mockUsers: usersList[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: '',
        },
        {
          id: '2',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: '',
        },
      ];
      mockUserService.getUsersList.and.returnValue(of({ data: mockUsers }));

      component.getUsersList();

      expect(mockUserService.getUsersList).toHaveBeenCalled();
      expect(component.usersList).toEqual(mockUsers);
    });
  });

  describe('openUserView', () => {
    it('should set showUser to true and userID correctly', () => {
      const user = { id: 1 };
      component.openUserView(user, 0);

      expect(component.showUser).toBeTrue();
      expect(component.userID).toBe(user.id);
    });
  });

  describe('closeViewMode', () => {
    it('should set showUser to the event value', () => {
      component.closeViewMode(false);

      expect(component.showUser).toBeFalse();
    });
  });

  describe('getSelectedUser', () => {
    it('should set selectedUser and stop event propagation', () => {
      const user = { id: 1 };
      const event = { stopPropagation: jasmine.createSpy('stopPropagation') };

      component.getSelectedUser(user, event);

      expect(component.selectedUser).toEqual(user);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('onUserDeleted', () => {
    it('should remove the user from usersList', () => {
      const mockUsers: usersList[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: '',
        },
        {
          id: '2',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: '',
        },
      ];
      component.usersList = mockUsers;

      component.onUserDeleted('1');

      expect(component.usersList).toEqual([
        {
          id: '2',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: '',
        },
      ]);
    });
  });

  describe('trackAddEditUser', () => {
    it('should update usersList on save action', () => {
      const updatedUser: usersList = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: '',
        avatar: 'https://example.com/avatar.jpg',
      };
      const user$ = of({ actionType: 'save', id: '1', model: updatedUser });
      mockUserService.user$ = user$;
      const initialUsers: usersList[] = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: '',
          avatar: 'https://example.com/avatar.jpg',
        },
      ];
      component.usersList = initialUsers;

      component.trackAddEditUser();

      expect(component.usersList).toEqual([updatedUser]);
    });

    it('should add new user on add action', () => {
      const newUser: usersList = {
        id: '1',
        first_name: 'John',
        last_name: 'Doe',
        email: '',
        avatar: 'https://example.com/avatar.jpg',
      };
      const user$ = of({
        actionType: 'add',
        model: newUser,
        response: { id: '1' },
      });
      mockUserService.user$ = user$;
      component.usersList = [];

      component.trackAddEditUser();

      expect(component.usersList).toEqual([newUser]);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const unsubscribeSpy = spyOn(component.subscriptions, 'unsubscribe');
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
