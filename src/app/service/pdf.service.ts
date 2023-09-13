import { jsPDF } from 'jspdf';
import { Injectable } from '@angular/core';
import { MinuteService } from './minute-servce';
import html2canvas from 'html2canvas';



@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor() {}
  
  generatePDF(DATA: any): void {
 
    const doc = new jsPDF( 'p', 'px', 'a4');
  
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
     /*  const imgProps = doc.getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; */
      doc.addImage(img, 'PNG', bufferX, bufferY, 500, 600);
      // let fileWidth = 208;
      // let fileHeight = (canvas.height * fileWidth) / canvas.width;
      // doc.addImage(img, 'PNG', 0, 0, fileWidth, fileHeight);


      return doc;
    }).then((docResult) => {
      docResult.save(`tutorial.pdf`);
    }); 


  } 

    
}
  

