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

  minute: Minute = data[0];

  @ViewChild('fToltal') formTotal: NgForm;
  @ViewChildren(NgForm) formulariosSecundarios: QueryList<NgForm>;

  constructor( private loadingCtrl: LoadingController, private router: Router, private saveMinutesService:SaveMinutesService) { }

  async submitForm() {
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
      }
    } else {
      // Al menos un formulario tiene campos obligatorios vacíos
      alert('Por favor, completa todos los campos obligatorios en todos los formularios.');
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
  }

}
