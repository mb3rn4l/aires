import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  
  constructor(public authService: AuthService, public router: Router) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLoggedIn = this.authService.isLoggedIn;
      /* console.log('canActivate - isLoggedIn:', isLoggedIn); */

      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
      return isLoggedIn;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLoggedIn = this.authService.isLoggedIn;
      /* console.log('canActivateChild - isLoggedIn:', isLoggedIn); */

      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
      return isLoggedIn;
  }
}
  
/* 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isLoggedIn !== true) {
        
        this.router.navigate(['/login']);
      }
      return true;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isLoggedIn !== true) {
        this.router.navigate(['/login']);
      }
      return true;
  }
  
}
 */