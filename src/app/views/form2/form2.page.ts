import { Component, OnInit } from '@angular/core';
import { PdfService } from 'src/app/service/pdf.service';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.page.html',
  styleUrls: ['./form2.page.scss'],
})
export class Form2Page implements OnInit {

  constructor(private pdfService: PdfService) { }

  ngOnInit() {
  }

  generatePDF() {
    const DATA = document.getElementById("prueba");
    console.log(DATA)
    this.pdfService.generatePDF(DATA);
  }

}
