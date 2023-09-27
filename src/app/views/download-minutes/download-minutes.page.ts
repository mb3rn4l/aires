import { Component, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { Minute } from 'src/app/share/models/minuteData';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {

  numInforme: string = ''; // Propiedad para almacenar el valor del ion-input

  constructor(private router: Router, private minuteService: MinuteService, private loadingCtrl: LoadingController, private alertController: AlertController) {}


  async descargarM() {
    console.log('Valor de this.numInforme:', this.numInforme);
  
      // Verificar si el campo numInforme no está vacío
    if (this.numInforme.trim() === '') {
      // Llamar a la función showEmptyFieldsAlert si el campo está vacío
      await this.showEmptyFieldsAlert();
      return; // Detener la ejecución si el campo está vacío
    }
    // Mostrar el indicador de carga
    let loading = await this.loadingCtrl.create();
    await loading.present();
  
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
            alert('No es posible consultar el informe técnico en estos momentos');
          } else {
            alert('Número de informe no encontrado, vuelve a intentarlo');
          }
        } 
      }
    ).add(() => {
      // Ocultar el indicador de carga cuando la solicitud haya terminado
      loading.dismiss();
    });
  }
  
  
  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK'],
    });

    await alert.present();
  }
  
  ngOnInit() {


  }

}
