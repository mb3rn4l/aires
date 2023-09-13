import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from 'src/app/share/models/user';
import { LoginForm } from 'src/app/share/models/loginForm';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router) { 

      /* Saving user data in localstorage when 
      logged in and setting up null when logged out */
      this.angularFireAuth.authState.subscribe((user) => {
        if (user) {
          console.log("entro aqui ")
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);

        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      });
    }

    signIn(loginForm: LoginForm) : Promise<any> {
      // try {
        return this.angularFireAuth
          .signInWithEmailAndPassword(loginForm.email, loginForm.password);

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

    // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null 
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  async signOut() {
    await this.angularFireAuth.signOut();
    localStorage.removeItem('user');
    // this.router.navigate(['sign-in']);
  }
}
