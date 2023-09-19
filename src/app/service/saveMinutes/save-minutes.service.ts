import { Minute } from './../../share/models/minuteData';
import { Injectable } from '@angular/core';
import {
  AngularFireList,
  AngularFireObject,
} from '@angular/fire/compat/database';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class SaveMinutesService {
  bookingListRef: AngularFireList<any>;
  bookingRef: AngularFireObject<any>;

  constructor(private angularFirestore: AngularFirestore) { }

  setUserData(CreateMinute: Minute) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `minutes/${CreateMinute.equipment_code}`
    );
    return userRef.set(CreateMinute, {
      merge: true,
    });
  }
}
