import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AddEditModalComponent } from './add-edit-modal.component';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';

fdescribe('AddEditModalComponent', () => {
  let component: AddEditModalComponent;
  let fixture: ComponentFixture<AddEditModalComponent>;
  let mockUserService: jasmine.SpyObj<UsersService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', [
      'updateUser',
      'addUser',
      'emitUser',
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      declarations: [AddEditModalComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    mockUserService = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    mockToastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addEditUser', () => {
    it('should call updateUser if actionType is save', () => {
      spyOn(component, 'updateUser').and.callThrough();
      component.actionType = 'save';
      mockUserService.updateUser.and.returnValue(of({}));
      component.addEditUser();
      expect(component.updateUser).toHaveBeenCalled();
    });

    it('should call addUser if actionType is not save', () => {
      spyOn(component, 'addUser').and.callThrough();
      component.actionType = 'add';
      mockUserService.addUser.and.returnValue(of({}));
      component.addEditUser();
      expect(component.addUser).toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('should update user and emit success', () => {
      const mockUser = { id: '1', name: 'Test User', job: 'Tester' };
      component.user = mockUser;
      mockUserService.updateUser.and.returnValue(of({}));

      spyOn(component.closeModalButton.nativeElement, 'click');
      component.updateUser();

      expect(mockUserService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        component.model
      );
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'User have been added successfully',
        EToasterTypes.success
      );
      expect(component.closeModalButton.nativeElement.click).toHaveBeenCalled();
    });

    it('should handle error on updateUser', () => {
      mockUserService.updateUser.and.returnValue(of(null as any));

      spyOn(component.closeModalButton.nativeElement, 'click');
      component.updateUser();

      expect(mockUserService.updateUser).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'an error occurred while adding user',
        EToasterTypes.error
      );
      expect(component.closeModalButton.nativeElement.click).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should add user and emit success', () => {
      mockUserService.addUser.and.returnValue(of({}));

      spyOn(component.closeModalButton.nativeElement, 'click');
      component.addUser();

      expect(mockUserService.addUser).toHaveBeenCalledWith(component.model);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'User have been added successfully',
        EToasterTypes.success
      );
      expect(component.closeModalButton.nativeElement.click).toHaveBeenCalled();
    });

    it('should handle error on addUser', () => {
      mockUserService.addUser.and.returnValue(of(null as any));

      spyOn(component.closeModalButton.nativeElement, 'click');
      component.addUser();

      expect(mockUserService.addUser).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'an error occurred while adding user',
        EToasterTypes.error
      );
      expect(component.closeModalButton.nativeElement.click).toHaveBeenCalled();
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
