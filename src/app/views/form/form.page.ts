import { Component, OnInit, ViewChild} from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { PdfService } from 'src/app/service/pdf/pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map} from 'rxjs/operators'; 

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  minuteData: Minute | undefined = undefined; // Inicializa con null
  id:number

  @ViewChild('child1', {static:false}) myContainer!: any;

  constructor(private minuteService: MinuteService, private pdfService: PdfService, private route: ActivatedRoute,private router: Router) {  }

  shouldMark(value: string, targetValue: string): boolean {
    return value === targetValue;
    
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id'))
    ).subscribe((numInforme) => {
      if (numInforme) {
        this.minuteService.getAllMinuteData(numInforme).subscribe(
          (data: Minute) => {
            this.minuteData = data;
            // Imprimir el código de estado 200 en caso de éxito
            console.log('Código de estado:', 200);
          },
          (error) => {
            console.error('Error al obtener datos', error);
            if (error && error.status) {
              // Imprimir el código de estado del error en la consola
              console.log('Código de estado:', error.status);
              if (error.status === 500) {
                // Si el código de estado es 500, muestra un mensaje específico de error
                console.log('No es posible consultar el informe tecnico en estos momentos');
              }
            } else {
              // En caso de un error sin un código de estado, muestra un mensaje genérico
              console.log('Error inesperado:', error);
            }
          }
        );  
      } else {
        console.log('No se proporcionó un número de informe en la URL.');
      }
    });
  }

  generatePDF() {
    const DATA =this.myContainer.el;
    this.pdfService.generatePDF(DATA);
  }

  
}
