import { Component, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { Minute } from 'src/app/share/models/minuteData';

@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {

  numInforme: string = ''; // Propiedad para almacenar el valor del ion-input

  constructor(private router: Router, private minuteService: MinuteService) {}


  descargarM() {
    console.log('Valor de this.numInforme:', this.numInforme);
  
    // Validar el número de informe antes de la navegación
    this.minuteService.getAllMinuteData(this.numInforme).subscribe(
      (data: Minute) => {
        if (data) {
          // Imprimir el código de estado 200 en caso de éxito
          console.log('Código de estado:', 200);
          // Navegar a la página 'form' con el parámetro 'numInforme'
          this.router.navigate([`/form/${this.numInforme}`]);
        } else {
          // Mostrar una alerta si la solicitud no se completó con éxito
          alert('Error: No devolvió datos válidos');
        }
      },
      (error) => {
        // Mostrar una alerta en caso de error
        if (error && error.status) {
          // Imprimir el código de estado del error en la consola
          console.log('Código de estado:', error.status);
          if (error.status === 500) {
            // Si el código de estado es 500, muestra un mensaje específico de error
            alert('No es posible consultar el informe tecnico en estos momentos ');
          } else {
            alert('Número de informe no encontrado, vuelve a intentarlo');
          }
        } 
      }
    );
  }
  

  
  ngOnInit() {


  }

}
