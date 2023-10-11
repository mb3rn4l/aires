import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, find, map, of } from 'rxjs';
import { Minute } from 'src/app/share/models/minuteData';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { ReactiveStore } from 'src/app/app-store';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class MinuteService {
  private apiUrlBase = '/cali-aires-dev/us-central1/app';
  //'https://us-central1-cali-aires-dev.cloudfunctions.net/app';

  constructor(
    private http: HttpClient,
    private angularFirestore: AngularFirestore,
    private reactiveStore: ReactiveStore,
    private storage: Storage
  ) {}

  // Método para obtener todos los datos de la API
  requestMinutePDF(equipmentCode: string): Observable<any> {
    const apiUrl = `http://localhost:5001/cali-aires-dev/us-central1/app/api/minutes2/${equipmentCode}`;

    return this.http.get(apiUrl, {
      headers: { 'Content-Type': 'text', Accept: 'application/pdf' },
      responseType: 'blob',
    });
  }

  saveMinuteInCloud(minute: Minute) {
    this.saveInFirestore(minute);
    this.removeFromLocalStorage(minute.equipment_code);
    this.removeFromReactiveStore(minute.equipment_code);
  }

  private saveInFirestore(minute: Minute) {
    // return this.angularFirestore.collection('minutes').add(minute);

    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `minutes/${minute.equipment_code}`
    );
    return userRef.set(minute, {
      merge: true,
    });
  }

  private removeFromReactiveStore(equipmentCode: string) {
    const storedMinutes = this.reactiveStore.value.minutes;

    const newMinutes = storedMinutes.filter(
      (storedMinute) => storedMinute.equipment_code !== equipmentCode
    );

    this.reactiveStore.set('minutes', newMinutes);
  }

  private removeFromLocalStorage(equipmentCode: string) {
    this.storage.remove(`minute/${equipmentCode}`);
  }

  discardMinute(equipmentCode: string) {
    this.removeFromLocalStorage(equipmentCode);
    this.removeFromReactiveStore(equipmentCode);
  }

  saveLocally(minute: Minute) {
    // save in local storage
    console.log(minute);
    this.storage.set(`minute/${minute.equipment_code}`, minute);
    this.updateReactiveStore(minute);
  }

  getFromReactiveStore(equipmentCode: string) {
    return this.reactiveStore.select<Minute[]>('minutes').pipe(
      map((minutes) => {
        return minutes.find(
          (minute) => (minute.equipment_code = equipmentCode)
        );
      })
    );
  }

  async loadMinutes() {
    let localKeys = await this.storage.keys();
    let minutes: Minute[] = [];

    for (let key of localKeys) {
      const localMinute: Minute = await this.storage.get(key);
      minutes = [...minutes, localMinute];
    }

    this.reactiveStore.set('minutes', minutes);
  }

  private updateReactiveStore(minute: Minute) {
    // update reactive store
    const storedMinutes = this.reactiveStore.value.minutes;

    const localMinute = storedMinutes.find(
      (storedMinute) => storedMinute.equipment_code === minute.equipment_code
    );
    let newMinutes: Minute[] = [];

    if (localMinute) {
      newMinutes = storedMinutes.map((storedMinute) => {
        if (minute.equipment_code === storedMinute.equipment_code) {
          return minute;
        }

        return storedMinute;
      });
    } else {
      newMinutes.push(minute);
    }

    this.reactiveStore.set('minutes', newMinutes);
  }
}
