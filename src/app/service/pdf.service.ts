import { jsPDF } from 'jspdf';
import { FormPage } from '../views/form/form.page';
import { Injectable } from '@angular/core';
import { MinuteService } from './minute-servce';
import html2canvas from 'html2canvas';



@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private minuteService: MinuteService) {}




  
  generatePDF(DATA: any): void {
    const minuteData = this.minuteService.getMinuteData();
    
    if (!minuteData) {
      console.error('No se encontraron datos de Minute.');
      return;
    }

 /*  
   html2canvas(DATA, {scale: 1, width: 2480, height: 3508}).then((canvas) => {
      let fileWidth = 200;
      let fileHeight = 500//(canvas.height * fileWidth) / canvas.width;
      // canvas.width  = 800;
      // canvas.height = 600;
      const FILEURI = canvas.toDataURL("image/png");
      
      let PDF = new jsPDF('p', 'px', 'a4');
      let position = 0;
      
      PDF.addImage(FILEURI, 'PNG', 0, 0, canvas.width, canvas.height);
      PDF.save('angular-demo.pdf'); 

      
    }); */
   
 /*  } */
 
   
    const doc = new jsPDF( 'p', 'mm', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`tutorial.pdf`);
    }); 


  } 

    
}
  

