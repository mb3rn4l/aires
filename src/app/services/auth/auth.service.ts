import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';

import { CreateUserForm } from './../../share/models/createUserForm';
import { LoginForm } from 'src/app/share/models/loginForm';
import { FirestoreUser } from 'src/app/share/models/firestoreUser';
import { UserService } from 'src/app/services/user/user.service';

import { Observable, map, of, switchMap, tap } from 'rxjs';
import { ReactiveStore } from 'src/app/app-store';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState$ = this.angularFireAuth.authState.pipe(
    switchMap((next) => {
      if (next === null) {
        return of(null);
      } else {
        return this.getUserProfile(next.uid).pipe(
          map((userData) => {
            if (!userData) {
              return null;
            }

            return userData;
          })
        );
      }
    }),
    tap((result) => {
      this.reactiveStore.set('user', result);
    })
  );

  constructor(
    private router: Router,
    private reactiveStore: ReactiveStore,
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private saveInfoUser: UserService
  ) {
    // this.authState$.subscribe();
  }

  signIn(loginForm: LoginForm): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(
      loginForm.email,
      loginForm.password
    );
  }

  getUserProfile(uid: string): Observable<FirestoreUser | undefined> {
    return this.angularFirestore
      .doc<FirestoreUser>('users/' + uid)
      .valueChanges();
  }

  // Sign up with email/password
  async signUp(createForm: CreateUserForm): Promise<any> {
    const originalUser = await this.angularFireAuth.currentUser;

    const result = await this.angularFireAuth.createUserWithEmailAndPassword(
      createForm.email,
      createForm.password
    );

    const userData: FirestoreUser = {
      id: result.user!.uid!,
      name: createForm.name,
      email: createForm.email,
      isAdmin: false,
    };

    await this.saveInfoUser.saveUserInFirestore(userData);

    await this.angularFireAuth.updateCurrentUser(originalUser);
  }

  userCanNavigate() {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (!user) {
          this.router.navigateByUrl('/login');
          return false;
        }
        return true;
      })
    );
  }

  userCanLogin() {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (user) {
          this.router.navigateByUrl('/home');
          return false;
        }
        return true;
      })
    );
  }

  // Sign out
  async signOut() {
    await this.angularFireAuth.signOut();
    this.reactiveStore.set('user', null);
  }

  async forgotPassword(resetPasswordForm: string): Promise<any> {
    await this.angularFireAuth.sendPasswordResetEmail(resetPasswordForm);

    // window.alert(
    //   'Correo electrónico de restablecimiento de contraseña enviado, revisa tu bandeja de entrada.'
    // );
  }
}
