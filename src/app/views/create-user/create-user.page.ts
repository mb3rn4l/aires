import { Component, OnInit } from '@angular/core';
import { CreateUserForm } from 'src/app/share/models/createUserForm';
import { NgForm } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.page.html',
  styleUrls: ['./create-user.page.scss'],
})


export class CreateUserPage implements OnInit {
  public model: CreateUserForm = { name: "", email: "", password: "", confirmPassword: "" };
  @ViewChild('createForm') createForm: NgForm;
  showPassword = false;
  showPassword2 = false;
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';

  constructor(private router: Router, private loadingCtrl: LoadingController, private authService: AuthService, private alertController: AlertController) { }

  async datosForm() {
    if (this.createForm.valid) {
      // Obtén el valor del campo de contraseña según sea necesario
      const passwordValue = this.showPassword ? this.createForm.value.password : this.model.password;

      if (passwordValue.length >= 7) { // Verifica la longitud de la contraseña
        let loading = await this.loadingCtrl.create();
        loading.present();

        try {
          // Usa el valor correcto de la contraseña al hacer la llamada a signUp
          await this.authService.signUp({ ...this.createForm.value, password: passwordValue })
          this.router.navigate(["/home"]);
          await loading.dismiss();
        } catch (error) {
          console.log("no se pudo entrar al signUp")
        }
      } else {
        this.showPasswordLengthAlert(); // Muestra una alerta si la contraseña es demasiado corta
      }
    } else {
      this.showEmptyFieldsAlert();
    }
  }

  async showEmptyFieldsAlert() {
    const alert = await this.alertController.create({
      header: 'Campos Vacíos',
      message: 'Por favor, completa todos los campos obligatorios en el formulario.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async showPasswordLengthAlert() {
    const alert = await this.alertController.create({
      header: 'Contraseña demasiado corta',
      message: 'La contraseña debe tener al menos 7 caracteres.',
      buttons: ['OK']
    });

    await alert.present();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibility2() {
    this.showPassword2 = !this.showPassword2;
  }
 

  ngOnInit() { }
}
