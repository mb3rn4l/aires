import { Component } from '@angular/core';
import { CreateUserForm } from 'src/app/share/models/createUserForm';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})
export class CreateUserPage {
  public showPassword = false;
  public showPassword2 = false;

  public model: CreateUserForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async onSubmit() {
    let loading = await this.loadingCtrl.create();
    loading.present();

    try {
      await this.authService.signUp(this.model);
      this.router.navigate(['/home']);
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();

      const alert = await this.alertController.create({
        message: 'No se pudo crear el usuario',
        buttons: ['OK'],
      });

      await alert.present();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
}
