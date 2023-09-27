import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';

import { CreateUserForm } from './../../share/models/createUserForm';
import { LoginForm } from 'src/app/share/models/loginForm';
import { DataUserForms } from 'src/app/share/models/dataUserForm';
import { SaveUserService } from 'src/app/service/save/save-user.service';

import { map } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private saveInfoUser: SaveUserService)
     { 
      /* Saving user data in localstorage when 
      logged in and setting up null when logged out */
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  signIn(loginForm: LoginForm): Promise<any> {
    // try {
    return this.angularFireAuth.signInWithEmailAndPassword(
      loginForm.email,
      loginForm.password
    );

    // this.setUserData(result.user);

    // this.angularFireAuth.authState.subscribe((user_1) => {
    //   if (user_1) {
    //     this.router.navigate(['dashboard']);
    //   }
    // });
    // } catch (error: any) {
    //   window.alert(error.message);
    // }
  }

  // Sign up with email/password
  async signUp(createForm: CreateUserForm): Promise<any> {
    try {
      const originalUser = await this.angularFireAuth.currentUser;

      const result = await this.angularFireAuth.createUserWithEmailAndPassword(
        createForm.email,
        createForm.password
      );

      const userDataa: DataUserForms = {
        id: result.user!.uid!,
        name: createForm.name,
        email: createForm.email,

        isAdmin: false,
      };

      await this.saveInfoUser.setUserData(userDataa);

      await this.angularFireAuth.updateCurrentUser(originalUser);
    } catch (error: any) {
      window.alert(error.message);
    }
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    /* console.log('User in localStorage:', user); */
    return user !== null;
  }


  checkUser(){
    return this.angularFireAuth.authState.pipe(
			map((user) => {
				if (!user) {
					this.router.navigateByUrl("/login");
				}
				return !!user;
			})
		);
  }
 
  // Sign out
  async signOut() {
    await this.angularFireAuth.signOut();
    localStorage.removeItem('user');
    // this.router.navigate(['sign-in']);
  }

  // Reset Forggot password
  ForgotPassword(RPasswordForm: string):Promise<any> {
    return this.angularFireAuth
      .sendPasswordResetEmail(RPasswordForm)
      .then(() => {
        window.alert('Correo electrónico de restablecimiento de contraseña enviado, revisa tu bandeja de entrada.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }
}
