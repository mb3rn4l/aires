import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';

import { CreateUserForm } from './../../share/models/createUserForm';
import { LoginForm } from 'src/app/share/models/loginForm';
import { DataUserForms } from 'src/app/share/models/dataUserForm';
import { SaveUserService } from 'src/app/services/save/save-user.service';

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
    private saveInfoUser: SaveUserService
  ) {
    this.authState$.subscribe();

    //   (result) => {
    //   console.log('result', result);
    //   this.reactiveStore.set('user', result);
    // });
  }

  signIn(loginForm: LoginForm): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(
      loginForm.email,
      loginForm.password
    );
  }

  getUserProfile(uid: string): Observable<DataUserForms | undefined> {
    return this.angularFirestore
      .doc<DataUserForms>('users/' + uid)
      .valueChanges();
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

  checkUser() {
    return this.angularFireAuth.authState.pipe(
      map((user) => {
        if (!user) {
          this.router.navigateByUrl('/login');
        }
        return !!user;
      })
    );
  }

  // Sign out
  signOut() {
    // console.log('this.signOut');
    return this.angularFireAuth.signOut().then(() => {
      this.reactiveStore.set('user', null);
    });
  }

  async forgotPassword(RPasswordForm: string): Promise<any> {
    try {
      await this.angularFireAuth.sendPasswordResetEmail(RPasswordForm);
      window.alert(
        'Correo electrónico de restablecimiento de contraseña enviado, revisa tu bandeja de entrada.'
      );
    } catch (error) {
      window.alert(error);
    }
  }
}
