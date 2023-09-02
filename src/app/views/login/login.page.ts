import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms'; // Importa NgForm



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = ''; // Propiedad para el campo de correo electrónico // Declaración de la propiedad para el correo electrónico
  password: string = '';

 /*  @ViewChild('emailInput') emailInput: NgForm; // Crea una referencia al elemento <input> */

 // Función para manejar el envío del formulario
 submitForm() {
  // Realizar lógica de validación adicional si es necesario
  if (!this.email) {
    // El campo de correo electrónico está vacío, puedes mostrar un mensaje de error
    console.log('El campo de correo electrónico no puede estar vacío.');
  } else {
    // El campo de correo electrónico contiene un valor, puedes continuar con el envío del formulario
    console.log('Formulario enviado con éxito.');
  }
}

  constructor() {

    
  }

  ngOnInit() {}

  login() {
    // Aquí puedes agregar la lógica real de inicio de sesión, como enviar los datos al servidor.
    console.log('Correo Electrónico:', this.email);
    
  }
}

