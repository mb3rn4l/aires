import { HttpClient } from '@angular/common/http';
import { data } from '../../mockMinutesData';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Minute } from 'src/app/share/models/minuteData';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MinuteService {
  private apiUrlBase = '/cali-aires-dev/us-central1/app';
  //'https://us-central1-cali-aires-dev.cloudfunctions.net/app';

  constructor(private http: HttpClient) {}

  // Método para obtener todos los datos de la API
  getAllMinuteData(numInforme: string): Observable<Minute> {
    const apiUrl = `${this.apiUrlBase}/api/minutes2/${numInforme}`;
    /*   return of(data); */

    return this.http
      .get<Minute>(
        `http://localhost:5001/cali-aires-dev/us-central1/app/api/minutes2/${numInforme}`,
        {
          headers: { 'Content-Type': 'application/pdf' },
        }
      )
      .pipe(
        catchError((error) => {
          throw error;
        })
      );
  }
}
