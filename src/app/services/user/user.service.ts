import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { FirestoreUser } from 'src/app/share/models/firestoreUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private angularFirestore: AngularFirestore) {}

  saveUserInFirestore(firestoreUser: FirestoreUser) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${firestoreUser.id}`
    );

    return userRef.set(firestoreUser, {
      merge: true,
    });
  }
}
