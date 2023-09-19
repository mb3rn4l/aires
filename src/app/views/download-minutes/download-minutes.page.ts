import { Component, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { MinuteService } from 'src/app/service/minute/minute-service';

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
        // Navegamos a la página 'form' y pasamos el valor de numInforme como un parámetro en la URL
        this.router.navigate([`/form/${this.numInforme}`]); // Utiliza comillas invertidas para incluir el valor en la URL
      } else {
        // Mostrar un mensaje de error al usuario
        alert('El número de informe no es válido. Por favor, ingrese un número de informe válido.');
      }
    } else {
      // Mostrar un mensaje de error al usuario
      alert('Por favor, ingrese un número de informe válido.');
    }
  }
  
  ngOnInit() {
  }

}
