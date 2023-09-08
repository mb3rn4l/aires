import { Component, OnInit } from '@angular/core';
import { Minute } from 'src/app/interfaceData';
import { MinuteService } from 'src/app/service/minute-servce';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  minuteData: Minute | null = null; // Inicializa con null

  constructor(private minuteService: MinuteService) {}

  getSymbol(value: boolean): string {
    return value ? "✓" : "";
  }

  ngOnInit() {
    // Obtiene los datos del JSON utilizando el servicio
    this.minuteData = this.minuteService.getMinuteData();

    if (this.minuteData) {
      // Imprime el JSON en la consola del navegador
      console.log('JSON Data:', this.minuteData);
    }
  }

}
