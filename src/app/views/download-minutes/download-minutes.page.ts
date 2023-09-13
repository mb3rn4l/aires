import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinuteService } from 'src/app/service/minute-servce';


@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {

  constructor(private router: Router, private minuteService: MinuteService) { }

  numInforme: string = ''; // Propiedad para almacenar el valor del ion-input

  descargarM() {
    console.log('Valor de this.numInforme:', this.numInforme);
  
    // Verificamos que se haya ingresado un valor antes de navegar
    if (this.numInforme) {
      // Verificar si el valor coincide con un código de equipo válido en el JSON
      const minuteData = this.minuteService.getMinuteData(this.numInforme);
      
      if (minuteData) {
        // Pasamos el valor por URL y navegamos a la página 'form'
        this.router.navigate(['/form'], { queryParams: { equipment_code: this.numInforme } });
      } else {
        console.log('El número de informe no coincide con ningún código de equipo válido.');
        // Mostrar un mensaje de error al usuario
        alert('El número de informe no es válido. Por favor, ingrese un número de informe válido.');
      }
    } else {
      console.log('Por favor, ingrese un número de informe.');
      // Mostrar un mensaje de error al usuario
      alert('Por favor, ingrese un número de informe válido.');
    }
  }

  
  ngOnInit() {
  }

}
