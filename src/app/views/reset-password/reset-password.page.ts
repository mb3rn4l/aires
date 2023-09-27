import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ResetUserPassword } from 'src/app/share/models/resetUserPassword';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  public model2 : ResetUserPassword  = {email:""};
   @ViewChild('RPasswordForm') RPasswordForm: NgForm;
  
   constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService) {}

    async onClickSubmitReset() {
      console.log(this.model2)
      if (this.RPasswordForm.valid) {
        let loading = await this.loadingCtrl.create();
        loading.present();
        try {
          await this.authService.ForgotPassword(this.model2.email);
          this.router.navigate(["./login"]);
          await loading.dismiss();
        } catch (error) {
          await loading.dismiss();
          const alert = await this.alertController.create({
            message: 'algo salio mal',
            buttons: ['OK'],
          });
          await alert.present();
        }
      } else {
        this.showEmptyFieldsAlert();
      }
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
