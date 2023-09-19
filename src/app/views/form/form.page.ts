import { Component, OnInit, ViewChild} from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { MinuteService } from 'src/app/service/minute/minute-service';
import { PdfService } from 'src/app/service/pdf/pdf.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'; // Agrega la importación de 'map'

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  minuteData: Minute | undefined = undefined; // Inicializa con null
  id:number

  @ViewChild('child1', {static:false}) myContainer!: any;

  constructor(private minuteService: MinuteService, private pdfService: PdfService, private route: ActivatedRoute,private router: Router) {

  }

  shouldMark(value: string, targetValue: string): boolean {
    return value === targetValue;
  }

  ngOnInit() {

    this.route.paramMap.pipe(
      map((paramMap) => paramMap.get('id')) // 'id' es el nombre del parámetro en la ruta
    ).subscribe((equipmentCode) => {
      if (equipmentCode) {
        this.minuteData = this.minuteService.getMinuteData(equipmentCode);
    
        if (this.minuteData) {
          console.log('JSON Data:', this.minuteData);
          //  this.generatePDF();
        } else {
          console.log('No se encontraron datos para el código de equipo:', equipmentCode);
        }
      } else {
        console.log('No se proporcionó un código de equipo en la URL.');
      }
    });

  }

  generatePDF() {
    const DATA =this.myContainer.el;
    this.pdfService.generatePDF(DATA);
  }

  
}
