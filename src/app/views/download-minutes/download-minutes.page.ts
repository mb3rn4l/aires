import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { Minute } from 'src/app/share/models/minuteData';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-download-minutes',
  templateUrl: './download-minutes.page.html',
  styleUrls: ['./download-minutes.page.scss'],
})
export class DownloadMinutesPage implements OnInit {
  numInforme: string = '';
  isAuthenticated: boolean = false;
  isCaptchaValid2 = false;

  siteKey = environment.firebase.recaptcha.siteKey;

  constructor(
    private router: Router,
    private minuteService: MinuteService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.siteKey;
  }

  async descargarM() {
    console.log('Valor de this.numInforme:', this.numInforme);

    if (this.numInforme.trim() === '') {
      console.log('Campo numInforme vacío');
      await this.showEmptyFieldsAlert();
      return;
    }

    if (!this.isAuthenticated && !this.isCaptchaValid2) {
      console.log('reCAPTCHA no resuelto');
      await this.showRecaptchaAlert();
      return;
    }

    let loading = await this.loadingCtrl.create();
    await loading.present();

    window.open(
      `http://localhost:5001/cali-aires-dev/us-central1/app/api/minutes2/${this.numInforme}`,
      '_blank'
    );

    // Espera un corto período de tiempo antes de continuar la suscripción
    // setTimeout(() => {
    //   this.minuteService
    //     .getAllMinuteData(this.numInforme)
    //     .subscribe(
    //       (data: Minute) => {
    //         if (data) {
    //           console.log('Código de estado:', 200);

    //           console.log('data', data);
    //           //this.router.navigate([`/form/${this.numInforme}`]);
    //         } else {
    //           alert('Error: No devolvió datos válidos');
    //         }
    //       },
    //       (error) => {
    //         console.log('error', error);

    //         if (error && error.status) {
    //           console.log('Código de estado:', error.status);
    //           if (error.status === 500) {
    //             alert(
    //               'No es posible consultar el informe técnico en estos momentos'
    //             );
    //           } else {
    //             alert('Número de informe no encontrado, vuelve a intentarlo');
    //           }
    //         }
    //       }
    //     )
    //     .add(() => {
    //       loading.dismiss();
    //     });
    // }, 1000); // Espera 1 segundo antes de continuar, puedes ajustar el tiempo según sea necesario
  }

  //metodos de validacion de campos
  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor, completa todos los campos.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async showRecaptchaAlert() {
    const alert = await this.alertController.create({
      message: 'Por favor, complete el reCaptcha antes de continuar.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  captchaResolved2(ev: any) {
    this.isCaptchaValid2 = true;
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn;
  }
}
