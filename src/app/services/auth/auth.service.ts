import { User } from './../../share/models/user';
import { CreateUserForm } from './../../share/models/createUserForm';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginForm } from 'src/app/share/models/loginForm';
import { DataUserForms } from 'src/app/share/models/dataUserForm';
import { SaveUserService } from 'src/app/service/save/save-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public afAuth: AngularFireAuth,
    private angularFireAuth: AngularFireAuth,
    private saveInfoUser: SaveUserService
  ) {
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
      const originalUser = await this.afAuth.currentUser;

      const result = await this.afAuth.createUserWithEmailAndPassword(
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

      await this.afAuth.updateCurrentUser(originalUser);
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

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */

  // Sign out
  async signOut() {
    await this.angularFireAuth.signOut();
    localStorage.removeItem('user');
    // this.router.navigate(['sign-in']);
  }

  // Reset Forggot password
  ForgotPassword(RPasswordForm: string):Promise<any> {
    return this.afAuth
      .sendPasswordResetEmail(RPasswordForm)
      .then(() => {
        window.alert('Correo electrónico de restablecimiento de contraseña enviado, revisa tu bandeja de entrada.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }


  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser; // Verifica si existe un usuario autenticado
  }
}
