import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { AppRoutes } from 'src/app/app-routes';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
  { path: AppRoutes.users.list, component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersListRoutingModule {}
