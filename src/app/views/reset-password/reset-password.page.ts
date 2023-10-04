import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth/auth.service';
import { ResetUserPassword } from 'src/app/share/models/resetUserPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  public model: ResetUserPassword = { email: '' };

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  async onSubmit() {
    let loading = await this.loadingCtrl.create();
    loading.present();
    try {
      await this.authService.forgotPassword(this.model.email);
      this.router.navigate(['./login']);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        message: 'No se pudo enviar el correo',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
