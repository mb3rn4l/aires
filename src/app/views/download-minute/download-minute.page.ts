import { Component } from '@angular/core';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ReactiveStore } from 'src/app/app-store';
import { DownloadMinuteForm } from 'src/app/share/models/downloadMinuteForm';
import { Minute } from 'src/app/share/models/minuteData';

@Component({
  selector: 'app-download-minute',
  templateUrl: './download-minute.page.html',
  styleUrls: ['./download-minute.page.scss'],
})
export class DownloadMinutesPage {
  model: DownloadMinuteForm = {
    equipmentCode: '',
    captcha: '',
  };

  minutes: Minute[] = [];

  siteKey = environment.firebase.recaptcha.siteKey;

  userData$ = this.reactiveStore.select('user');

  areMinutesRequested: boolean = false;

  constructor(
    private reactiveStore: ReactiveStore,
    private minuteService: MinuteService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  onSubmit = async () => {
    let loading = await this.loadingCtrl.create();
    loading.present();

    this.minuteService
      .requestLastFiveMinutes(this.model.equipmentCode)
      .subscribe({
        next: async (minutes) => {
          this.areMinutesRequested = true;
          this.minutes = minutes;
          await loading.dismiss();
        },
        error: async (error) => {
          await loading.dismiss();
        },
      });
  };

  onRequestAgain() {
    this.areMinutesRequested = false;
    this.minutes = [];
    this.model = {
      equipmentCode: '',
      captcha: '',
    };
  }

  async onDownloadPDF(minuteId: string) {
    let loading = await this.loadingCtrl.create();
    loading.present();

    this.minuteService.requestMinutePDF(minuteId).subscribe({
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
