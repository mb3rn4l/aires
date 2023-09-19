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
				this.router.navigate(["home"]);
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
      
    }
    
  }
}

