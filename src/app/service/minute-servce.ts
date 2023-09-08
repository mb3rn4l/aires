
import { data } from '../mockMinutesData';
import { Minute } from '../interfaceData';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class MinuteService {

  // Método que devuelve los datos del JSON
  getMinuteData(): Minute {
    return data; // Retorna el objeto JSON importado desde 'mockMinutesData'
  }

  constructor() { }
}
