import { Component } from '@angular/core';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ReactiveStore } from 'src/app/app-store';
import { DownloadMinuteForm } from 'src/app/share/models/downloadMinuteForm';

@Component({
  selector: 'app-download-minute',
  templateUrl: './download-minute.page.html',
  styleUrls: ['./download-minute.page.scss'],
})
export class DownloadMinutesPage {
  model: DownloadMinuteForm = {
    minuteCode: '',
    captcha: '',
  };

  siteKey = environment.firebase.recaptcha.siteKey;

  userData$ = this.reactiveStore.select('user');

  constructor(
    private reactiveStore: ReactiveStore,
    private minuteService: MinuteService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {
    this.siteKey;
  }

  async onSubmit() {
    let loading = await this.loadingCtrl.create();
    loading.present();

    this.minuteService.requestMinutePDF(this.model.minuteCode).subscribe({
      next: (data) => {
        if (data) {
          loading.dismiss();

          var file = new Blob([data], { type: 'application/pdf' });
          var fileURL = window.URL.createObjectURL(file);
          window.open(fileURL);
        }
      },
      error: async (error) => {
        await loading.dismiss();

        const alert = await this.alertController.create({
          buttons: ['OK'],
        });

        if (error.status === 404) {
          alert.message = 'No existe un informe tecnico con ese codigo';
        }

        alert.message = 'No es posible genera el pdf';

        await alert.present();
      },
    });
  }
}
