import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router, 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  // Page Observable
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Returns value given by page | False or true
    return new Promise(resolve => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          this.router.navigate(['/home']);
          resolve(true);
          // console.log("Yes, login was successful.")
        } else {
          console.log('Not Logged In.');
          // this.router.navigate(['/landing']);
          resolve(false);
        }
      });
    });
  }
}
