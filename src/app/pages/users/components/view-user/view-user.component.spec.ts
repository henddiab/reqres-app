import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ViewUserComponent } from './view-user.component';
import { UsersService } from '../../services/users.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ViewUserComponent', () => {
  let component: ViewUserComponent;
  let fixture: ComponentFixture<ViewUserComponent>;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    mockUsersService = jasmine.createSpyObj('UsersService', ['getSingleUser']);

    await TestBed.configureTestingModule({
      declarations: [ViewUserComponent],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserComponent);
    component = fixture.componentInstance;
    component.userId = 1; // Set a default userId for testing
    fixture.detectChanges();
  });

  afterEach(() => {
    component.subscriptions.unsubscribe();
  });

  it('should set userData when getSingleUser is called', () => {
    const mockUserData = {
      data: {
        id: '1',
        first_name: 'john',
        last_name: 'Doe',
        avatar: '',
        email: '',
      },
    };
    mockUsersService.getSingleUser.and.returnValue(of(mockUserData));

    component.userId = '123';
    component.getSingleUser();

    fixture.detectChanges();

    expect(mockUsersService.getSingleUser).toHaveBeenCalledWith('123');
    expect(component.userData).toEqual(mockUserData.data);
  });

  it('should close view mode', () => {
    spyOn(component.closeView, 'emit');

    component.closeViewMode();

    expect(component.closeView.emit).toHaveBeenCalledWith(false);
  });

  it('should call getSingleUser when userId changes', () => {
    spyOn(component, 'getSingleUser').and.callThrough();
    mockUsersService.getSingleUser.and.returnValue(of({ id: 123 }));
    component.ngOnChanges();
    expect(component.getSingleUser).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions', () => {
    const unsubscribeSpy = spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
