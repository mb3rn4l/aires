import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
export class LoginPage implements OnInit {
   public model : LoginForm = {email:"", password: ""};
   @ViewChild('loginForm') loginForm: NgForm;
   emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private authService: AuthService) {}

  ngOnInit() {}

  async onClickSubmit() {
   
    if (this.loginForm.valid) {

      let loading = await this.loadingCtrl.create();
			loading.present();
      
      try {

				await this.authService.signIn(this.loginForm.value)
				this.router.navigate(["./create-user"]);
				await loading.dismiss();
        
			} catch (error) {
				
        await loading.dismiss();
        // mensaje de error 
        const alert = await this.alertController.create({
          message: 'Datos invalidos',
          buttons: ['OK'],
        });
    
        await alert.present();
			}
      
    }else {
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
}

