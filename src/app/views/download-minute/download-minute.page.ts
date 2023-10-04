import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MinuteService } from 'src/app/services/minute/minute.service';
// import { Minute } from 'src/app/share/models/minuteData';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
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
    private router: Router,
    private minuteService: MinuteService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
    this.siteKey;
  }

  async onSubmit() {
    console.log(this.model);
    // ----------------- WORK -----------------------------------------

    // let loading = await this.loadingCtrl.create();
    // await loading.present();
    // window.open(
    //   `http://localhost:5001/cali-aires-dev/us-central1/app/api/minutes2/${this.model.minuteCode}`,
    //   '_blank'
    // );

    // loading.dismiss();
    // ----------------------------------------------------------

    // TODO catch the error
    this.minuteService
      .requestMinute(this.model.minuteCode)
      .subscribe((data) => {
        if (data) {
          var file = new Blob([data.blob()], { type: 'application/pdf' });
          var fileURL = window.URL.createObjectURL(file);
          window.open(fileURL);
        }
      });
  }
}
