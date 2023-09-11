import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

 submitForm() {
  if (!this.email) {
    console.log('El campo de correo electrónico no puede estar vacío.');
  } else {
    console.log('Formulario enviado con éxito.');
  }
}

  constructor() {}

  ngOnInit() {}

  login() {
    console.log('Correo Electrónico:', this.email)
  }
}

