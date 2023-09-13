import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { filter } from 'rxjs';
import { Minute } from 'src/app/interfaceData';
import { MinuteService } from 'src/app/service/minute-servce';
import { PdfService } from 'src/app/service/pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';



@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {

  minuteData: Minute | undefined = undefined; // Inicializa con null

  @ViewChild('child1', {static:false}) myContainer!: any;

  constructor(private minuteService: MinuteService, private pdfService: PdfService, private route: ActivatedRoute,private router: Router) {

  }

  getSymbol(value: boolean): string {
    return value ? "✓" : "";
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const equipmentCode = params['equipment_code'];

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
    /* const DATA = document.querySelector("#container"); */
    const DATA =this.myContainer.el;
    // console.log(DATA)
    console.log(this.myContainer)
    this.pdfService.generatePDF(DATA);
  }

  
}
