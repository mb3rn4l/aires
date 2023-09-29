import { Directive, Input, HostListener } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AlertController } from '@ionic/angular'; // Importa el AlertController

@Directive({
  selector: '[appPasswordLength]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordLengthDirective,
      multi: true,
    },
  ],
})
export class PasswordLengthDirective implements Validator {
  @Input('appPasswordLength') minLength: number;

  constructor(private alertController: AlertController) {} // Inyecta el AlertController

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value || control.value.length < this.minLength) {
      // Si la contraseña no cumple con la longitud mínima, muestra un alert
      this.presentAlert();
      return { passwordLength: true };
    }
    return null;
  }

  // Función para mostrar un alert
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Contraseña demasiado corta',
      message: `La contraseña debe tener al menos ${this.minLength} caracteres.`,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
