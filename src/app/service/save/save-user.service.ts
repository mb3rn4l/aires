import { Injectable } from '@angular/core';
import {
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { DataUserForms } from 'src/app/share/models/dataUserForm';


@Injectable({
  providedIn: 'root'
})
export class SaveUserService {
  bookingListRef: AngularFireList<any>;
  bookingRef: AngularFireObject<any>;

  constructor(private angularFirestore: AngularFirestore) { }

  setUserData(CreateForm: DataUserForms) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${CreateForm.id}`
    );
    return userRef.set(CreateForm, {
      merge: true,
    });
  }

}
