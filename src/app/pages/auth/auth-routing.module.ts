import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppRoutes } from 'src/app/app-routes';

const identityAuth = () => {
  return {
    path: AppRoutes.auth.login,
    loadChildren: () =>
      import('./modules/login/login.module').then(
        (m) => m.LoginModule
      ),
  };
};

const routes: Routes = [{ ...identityAuth() }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
