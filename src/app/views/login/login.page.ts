import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginForm } from 'src/app/share/models/loginForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public model: LoginForm = { email: '', password: '' };

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
      await this.authService.signIn(this.model);
      this.router.navigate(['/home']);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        message: 'Datos invalidos',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }
}
