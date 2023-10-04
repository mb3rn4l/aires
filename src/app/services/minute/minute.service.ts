import { HttpClient } from '@angular/common/http';
import { data } from '../../mockMinutesData';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Minute } from 'src/app/share/models/minuteData';
import { catchError } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class MinuteService {
  private apiUrlBase = '/cali-aires-dev/us-central1/app';
  //'https://us-central1-cali-aires-dev.cloudfunctions.net/app';

  constructor(
    private http: HttpClient,
    private angularFirestore: AngularFirestore
  ) {}

  // Método para obtener todos los datos de la API
  requestMinute(minuteCode: string): Observable<any> {
    // const apiUrl = `${this.apiUrlBase}/api/minutes2/${numInforme}`;
    /*   return of(data); */

    return this.http.get<Minute>(
      `http://localhost:5001/cali-aires-dev/us-central1/app/api/minutes2/${minuteCode}`,
      {
        headers: { 'Content-Type': 'application/pdf' },
      }
    );
    // .pipe(
    //   catchError((error: any) => {
    //     return of(undefined);
    //   })
    // );
  }

  saveInFirestore(minute: Minute) {
    // return this.angularFirestore.collection('minutes').add(minute);

    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `minutes/${minute.equipment_code}`
    );
    return userRef.set(minute, {
      merge: true,
    });
  }
}
