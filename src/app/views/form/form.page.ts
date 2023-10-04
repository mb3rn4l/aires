import { Component, OnInit, ViewChild } from '@angular/core';
import { Minute } from 'src/app/share/models/minuteData';
import { MinuteService } from 'src/app/services/minute/minute.service';
import { PdfService } from 'src/app/services/pdf/pdf.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  minuteData: Minute | undefined = undefined;
  id: number;

  @ViewChild('child1', { static: false }) myContainer!: any;

  constructor(
    private minuteService: MinuteService,
    private pdfService: PdfService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  shouldMark(value: string, targetValue: string): boolean {
    return value === targetValue;
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(map((paramMap) => paramMap.get('id')))
      .subscribe((numInforme) => {
        if (numInforme) {
          this.minuteService.requestMinute(numInforme).subscribe(
            (data: Minute | undefined) => {
              this.minuteData = data;

              console.log('Código de estado:', 200);
            },
            (error) => {
              console.error('Error al obtener datos', error);
              if (error && error.status) {
                console.log('Código de estado:', error.status);
                if (error.status === 500) {
                  console.log(
                    'No es posible consultar el informe tecnico en estos momentos'
                  );
                }
              } else {
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
    /*  const DATA = this.myContainer.el;
    this.pdfService.generatePDF(DATA); */
  }
}
