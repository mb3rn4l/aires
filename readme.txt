Notas de instalaciónservicio api rest.

-> Ingresar a FireBase
-> Ingresar al proyecto 
-> Ingresar a las configuraciones de FireBase mediante simbolo de tuerca que esta al lado de Descripcion general
-> Dar click en configuración del proyecto
-> Dar click en cuentas de servicio
-> Dar click en generar nueva clave privada
-> Dar click en generar clave
-> Una vez descargada la clave, abrir el proyecto mediante consola
-> Ingresar en la carpeta de functions y generar el comando $ npm run build
-> Una vez generado el comando se creara una carpeta llamada lib, el cual contendra las funciones necesarias para el funcionamiento de la aplicación


Notas de instalación recaptcha

-> Ingresar en tu cuenta gmail a https://www.google.com/recaptcha/admin/create   
-> completa la casilla etiqueta
-> escogemos la version v2(casilla de verificacion)
->domino (localhost por el momento )
->el uso de cloud platform en este caso se usa y escogemos el de cali-aires(firebase)
-> AL VERIFICAR SE generan dos claves (publica y privada)
-> en los archivos (environment.ts y environment.prod.ts)
            copiar recaptcha: {
            siteKey: 'clave-publica',
            },
            
-> instalamos en el proyecto npm install ng-recaptcha

->Importe FormsModule, RecaptchaFormsModule, RecaptchaModule (en caso de no tenerlos). Configure la clave reCAPTCHA de Google. Cambie el app.module.ts (o en este caso share.module.ts) archivo y agregue las líneas como se muestra a continuación.

            import { FormsModule } from '@angular/forms';
            import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha'
            import { environment } from 'src/environments/environment';
            imports: [
                RecaptchaModule,
                RecaptchaFormsModule,
                ],
            providers: [
                    {
                    provide: RECAPTCHA_SETTINGS,
                    useValue: {
                    siteKey: environment.firebase.recaptcha.siteKey
                    } as RecaptchaSettings,
                    },
                ],

