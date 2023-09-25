import { HttpClient } from '@angular/common/http';
import { data } from '../../mockMinutesData';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Minute } from 'src/app/share/models/minuteData';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MinuteService {

  private apiUrlBase = "https://us-central1-cali-aires-dev.cloudfunctions.net/app"; // URL to web api

  constructor(private http: HttpClient) { }

  // Método para obtener todos los datos de la API
  getAllMinuteData(numInforme: string): Observable<Minute> {
    const apiUrl = `${this.apiUrlBase}/api/minutes/${numInforme}`;
     return of(data[0]) ; 
    
 /*  return this.http.get<Minute>(apiUrl).pipe(
    catchError((error) => {
      throw error;
    })
  ); */

  
  }

}
