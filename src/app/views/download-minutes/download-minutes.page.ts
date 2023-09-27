import { Component, OnInit } from '@angular/core';
import { Router, ParamMap } from '@angular/router';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { Minute } from 'src/app/share/models/minuteData';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {
  numInforme: string = ''; // Propiedad para almacenar el valor del ion-input
  isNotAuthenticated: boolean = false; // propiedad de autentificacion de usuario
  token: string | undefined; // propieddad de recaptcha

  constructor(
    private router: Router,
    private minuteService: MinuteService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.token = undefined;
  }

  // metodo  de visualizar el formulario
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
    this.minuteService
      .getAllMinuteData(this.numInforme)
      .subscribe(
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
              alert(
                'No es posible consultar el informe técnico en estos momentos'
              );
            } else {
              alert('Número de informe no encontrado, vuelve a intentarlo');
            }
          }
        }
      )
      .add(() => {
        // Ocultar el indicador de carga cuando la solicitud haya terminado
        loading.dismiss();
      });
  }

  //metodo de validacion de campos vacios
  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  //************RECAPTCHA***************/

  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      return;
    }

    console.debug(`Token [${this.token}] generated`);
  }

  //************FIN RECAPTCHA***************/

  ngOnInit() {
    this.authService.afAuth.authState.subscribe((user) => {
      if (user) {
        // El usuario está autenticado, muestra detalles del usuario
        console.log('Usuario autenticado:', user);
      } else {
        // El usuario no está autenticado
        console.log('El usuario NO está autenticado');
        // Asegúrate de que isNotAuthenticated se establezca en true aquí
        this.isNotAuthenticated = true;
      }
    });
  }
}
