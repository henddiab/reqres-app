import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { StorageService } from '../services/storage/storgae.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router, private auth: AuthService) {
    if (this.storageService.getToken()) return;
  }

  canActivate(): | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.auth.isUserLoggedIn;

    if (isLoggedIn) return true;
    else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
