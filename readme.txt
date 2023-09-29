Notas de instalación servicio api rest.

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
-> Completa la casilla etiqueta
-> Escogemos la version v2(casilla de verificacion)
-> Domino (localhost o 127.0.0.1) "depende de tu entorno de trabajo"
-> El uso de cloud platform en este caso se usa y escogemos el de cali-aires(firebase)
-> AL VERIFICAR se generan dos claves (publica y privada)

-> En los archivos (environment.ts y environment.prod.ts)
            copiar recaptcha: {
            siteKey: 'clave-publica',
            },
            
-> Instalamos en el proyecto npm install npm i ng-recaptcha --save

-> Importe la dependencia  import { RecaptchaModule } from 'ng-recaptcha'; en el modulo correspondientede su pagina que vaya a usar y agregue las líneas como se muestra a continuación.

           import { RecaptchaModule } from 'ng-recaptcha'; -> en caso de la pagina a usar 
            imports: [
                NgxCaptchaModule
                ],

-> En el html se llama de esta manera
            <re-captcha
              [siteKey]="siteKey"
            ></re-captcha>

-> En su ts, se llama a la clave publica y ejecuta en el constructor 

            siteKey = environment.firebase.recaptcha.siteKey;
            constructor(
            
            ) {
                this.siteKey;
            }
                    

