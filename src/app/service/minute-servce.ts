import { DownloadMinutesPageModule } from './../views/download-minutes/download-minutes.module';
import { Minute } from './../interfaceData';

import { data } from '../mockMinutesData';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class MinuteService {

  // Método que devuelve los datos del JSON
  getMinuteData(minuteId :string) {
    return data.find((item => item.equipment_code === minuteId));
  }

  constructor() { }
}
