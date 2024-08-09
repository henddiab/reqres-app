import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    FormlyModule.forRoot(),
    ReactiveFormsModule,
    FormlyBootstrapModule,
  ],
  exports: [NavbarComponent],
})
export class SharedModule {}
