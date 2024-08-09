import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DeleteModalComponent } from './delete-modal.component';
import { UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';
import { EToasterTypes } from 'src/app/@core/enums/toast.enum';
describe('DeleteModalComponent', () => {
  let component: DeleteModalComponent;
  let fixture: ComponentFixture<DeleteModalComponent>;
  let mockUserService: jasmine.SpyObj<UsersService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UsersService', ['deleteUser']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DeleteModalComponent],
      providers: [
        { provide: UsersService, useValue: userServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    }).compileComponents();

    mockUserService = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
    mockToastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteUser', () => {
    it('should call deleteUser and handle success', () => {
      const mockUser = { id: '1' };
      component.user = mockUser;
      mockUserService.deleteUser.and.returnValue(of(true)); // Mock success response

      spyOn(component.closeModalButton.nativeElement, 'click');
      spyOn(component.userDeleted, 'emit');

      component.deleteUser();

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'User have been added successfully',
        EToasterTypes.success
      );
      expect(component.userDeleted.emit).toHaveBeenCalledWith(mockUser.id);
      expect(component.closeModalButton.nativeElement.click).toHaveBeenCalled();
    });

    it('should handle error when deleteUser fails', () => {
      const mockUser = { id: '1' };
      component.user = mockUser;
      mockUserService.deleteUser.and.returnValue(of(null as any)); // Mock error response

      spyOn(component.closeModalButton.nativeElement, 'click');
      spyOn(component.userDeleted, 'emit');

      component.deleteUser();

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'an error occurred while adding user',
        EToasterTypes.error
      );
      expect(component.userDeleted.emit).not.toHaveBeenCalled();
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
