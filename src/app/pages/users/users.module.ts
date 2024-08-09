import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UsersListRoutingModule } from './users-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ViewUserComponent } from './components/view-user/view-user.component';
import { AddEditModalComponent } from './components/add-edit-modal/add-edit-modal.component';
import { DeleteModalComponent } from './components/delete-modal/delete-modal.component';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

@NgModule({
  declarations: [
    UsersListComponent,
    HeaderComponent,
    ViewUserComponent,
    AddEditModalComponent,
    DeleteModalComponent,
  ],
  imports: [
    CommonModule,
    UsersListRoutingModule,
    FormlyModule.forRoot(),
    ReactiveFormsModule,
    FormlyBootstrapModule,
  ],
})
export class UsersModule {}
