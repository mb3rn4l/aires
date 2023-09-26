
import { SaveMinutesService } from './../../service/saveMinutes/save-minutes.service';
import { Component, OnInit, ViewChild, QueryList,ViewChildren } from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { data } from 'src/app/mockMinutesData';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.page.html',
  styleUrls: ['./create-report.page.scss'],
})
export class CreateReportPage implements OnInit {

  
  minute: Minute = data; 

  @ViewChild('fToltal') formTotal: NgForm;
  @ViewChildren(NgForm) formulariosSecundarios: QueryList<NgForm>;

  constructor( private loadingCtrl: LoadingController, private router: Router, private saveMinutesService:SaveMinutesService) { }


  async submitForm() {
    // Mostrar el indicador de carga
    let loading = await this.loadingCtrl.create();
    await loading.present();

     // Establecer la fecha actual en formato "YYYY-MM-DD"
      const fechaActual = new Date();
      this.minute.date = fechaActual.toISOString().split('T')[0];
    
    
    console.log(this.minute)
    console.log("hi")
    // Verifica todos los formularios secundarios
    const formulariosValidos = this.formulariosSecundarios
      .toArray()
      .every((form) => this.validarFormulario(form));
  
    if (formulariosValidos) {
      try {
        // Llama al servicio para guardar los datos
        await this.saveMinutesService.addMinuteData(this.minute);
  
        // Todos los formularios son válidos, puedes continuar con el procesamiento
        alert('Formulario enviado correctamente');
        this.router.navigate(['/home']);
      } catch (error) {
        // Maneja cualquier error que pueda ocurrir al guardar los datos
        console.error('Error al guardar los datos:', error);
      } finally {
        // Ocultar el indicador de carga, ya sea que haya éxito o error
        loading.dismiss();
      }
    } else {
      // Al menos un formulario tiene campos obligatorios vacíos
      alert('Por favor, completa todos los campos obligatorios en todos los formularios.');
      // Ocultar el indicador de carga en caso de error
      loading.dismiss();
    }
  }
  

  // Función de validación  para un formulario 
  private validarFormulario(form: NgForm): boolean {
    return Object.keys(form.controls).every((controlName) => {
      const control = form.controls[controlName];
      return control.valid || !control.errors?.["required"];
    });
  }  
  
  ngOnInit() {
    this.minute.date = new Date().toISOString();
  }

}
